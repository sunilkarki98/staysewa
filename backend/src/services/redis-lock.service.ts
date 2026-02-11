import { redis } from '@/config/redis';
import { logger } from '@/utils/logger';
import { AppError } from '@/utils/AppError';

export const RedisLockService = {
    /**
     * Tries to acquire a lock for a specific key.
     * @param key The resource key to lock (e.g., "lock:availability:unit_123:2023-10-01")
     * @param ttlMs Time to live in milliseconds (default 5000ms)
     * @returns A random token string if lock is acquired, null otherwise.
     */
    async acquireLock(key: string, ttlMs: number = 5000): Promise<string | null> {
        if (!redis) {
            logger.warn('Redis not configured, skipping lock acquisition (unsafe for production concurrency)');
            return 'mock-token';
        }

        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

        try {
            // SET resource token NX PX ttl
            // NX: Only set if not exists
            // PX: Expire after ttl milliseconds
            const result = await redis.set(key, token, 'PX', ttlMs, 'NX');

            if (result === 'OK') {
                return token;
            }
            return null;
        } catch (error) {
            logger.error(error, `Failed to acquire lock for key ${key}`);
            return null;
        }
    },

    /**
     * Releases the lock only if the token matches.
     * This prevents deleting a lock that was already acquired by another process after expiry.
     */
    async releaseLock(key: string, token: string): Promise<void> {
        if (!redis || token === 'mock-token') return;

        try {
            // Lua script to safely checking value and delete
            const luaScript = `
                if redis.call("get", KEYS[1]) == ARGV[1] then
                    return redis.call("del", KEYS[1])
                else
                    return 0
                end
            `;

            await redis.eval(luaScript, 1, key, token);
        } catch (error) {
            logger.error(error, `Failed to release lock for key ${key}`);
        }
    }
};
