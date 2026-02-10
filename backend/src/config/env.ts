import dotenv from 'dotenv';
dotenv.config();

const getEnv = (key: string, required: boolean = true): string => {
    const value = process.env[key];
    if (required && !value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || '';
};

export const env = {
    NODE_ENV: getEnv('NODE_ENV', false) || 'development',
    PORT: parseInt(getEnv('PORT', false) || '4000', 10),
    DATABASE_URL: getEnv('DATABASE_URL', true),
    // Add other env vars here as needed
};
