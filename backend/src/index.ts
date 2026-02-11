import app from '@/app';
import { env } from '@/config/env';


const bootstrap = async () => {
    try {
        const port = env.PORT || 8000;

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
