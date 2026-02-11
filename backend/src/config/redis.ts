import Redis from 'ioredis';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

const redisUrl = env.REDIS_URL;

let redis: Redis | null = null;

if (redisUrl) {
    redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
    });

    redis.on('connect', () => {
        logger.info('Redis connected successfully');
    });

    redis.on('error', (err) => {
        logger.error(err, 'Redis connection error');
    });
} else {
    logger.warn('REDIS_URL not provided, caching will be disabled');
}

export { redis };
