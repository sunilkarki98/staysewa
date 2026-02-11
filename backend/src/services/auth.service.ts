import { db } from '@/db/index';
import { users } from '@/db/schema/index';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';

/**
 * Authentication Service
 * Handles user identity, token generation, and password security.
 */
export const AuthService = {
    /**
     * Generate JWT for a user
     */
    generateToken(id: string) {
        return jwt.sign({ id }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN as any,
        });
    },

    /**
     * Compare passwords
     */
    async comparePasswords(entered: string, stored: string) {
        return await bcrypt.compare(entered, stored);
    },

    /**
     * Login user by verifying credentials
     */
    async login(email: string, pass: string) {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user || !user.password) return null;

        const isMatch = await this.comparePasswords(pass, user.password);
        if (!isMatch) return null;

        const { password: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    /**
     * Signup new user
     */
    async signup(data: typeof users.$inferInsert) {
        const hashedPassword = await bcrypt.hash(data.password!, 12);

        const result = await db.insert(users).values({
            ...data,
            password: hashedPassword,
        }).returning();

        const user = result[0];
        const { password: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
};
