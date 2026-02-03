import type { FastifyInstance } from 'fastify';
import { prisma } from '../../config/database.js';

export async function healthRoutes(app: FastifyInstance) {
  // Basic health check
  app.get('/', async () => {
    return {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
    };
  });

  // Detailed health check with database
  app.get('/detailed', async () => {
    let dbStatus = 'healthy';
    let dbLatency = 0;

    try {
      const start = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - start;
    } catch {
      dbStatus = 'unhealthy';
    }

    return {
      success: true,
      data: {
        status: dbStatus === 'healthy' ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: dbStatus,
            latency: `${dbLatency}ms`,
          },
        },
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
    };
  });
}
