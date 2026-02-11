import app from '@/app';
import { env } from '@/config/env';


import cron from 'node-cron';
import { runBookingExpiryJob } from '@/jobs/booking-expiry.job';

const bootstrap = async () => {
    try {
        const port = env.PORT || 8000;

        // Schedule Background Jobs
        cron.schedule('* * * * *', () => {
            runBookingExpiryJob();
        });

        app.listen(port, () => {
            console.log(`🚀 Production-ready server running at http://localhost:${port}`);
            console.log(`📡 Environment: ${env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

bootstrap();
