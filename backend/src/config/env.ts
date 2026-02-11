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
    JWT_SECRET: getEnv('JWT_SECRET', true),
    JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', false) || '30d',
    CORS_ORIGIN: getEnv('CORS_ORIGIN', false) || 'http://localhost:3000',
    KHALTI_SECRET_KEY: getEnv('KHALTI_SECRET_KEY', false) || 'mock_secret_key',
    KHALTI_BASE_URL: getEnv('KHALTI_BASE_URL', false) || 'https://a.khalti.com/api/v2',
    REDIS_URL: getEnv('REDIS_URL', false),
    JWT_COOKIE_EXPIRES_IN: getEnv('JWT_COOKIE_EXPIRES_IN', false) || '30',
    SUPABASE_JWT_SECRET: getEnv('SUPABASE_JWT_SECRET', false),
};
