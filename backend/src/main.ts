import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

async function bootstrap() {
  try {
    // Connect to database
    await connectDatabase();

    // Create app
    const app = await createApp();

    // Graceful shutdown
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, shutting down gracefully...`);
        await app.close();
        await disconnectDatabase();
        process.exit(0);
      });
    });

    // Start server
    await app.listen({ port: env.PORT, host: env.HOST });

    logger.info(`Server running on http://${env.HOST}:${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
