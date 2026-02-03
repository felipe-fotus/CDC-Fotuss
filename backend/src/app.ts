import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler } from './shared/errors/error-handler.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { contractsRoutes } from './modules/contracts/contracts.routes.js';
import { clientsRoutes } from './modules/clients/clients.routes.js';

export async function createApp() {
  const app = Fastify({
    logger: false, // We use our own logger
  });

  // Plugins
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  // Error handler
  app.setErrorHandler(errorHandler);

  // Request logging
  app.addHook('onRequest', async (request) => {
    logger.debug({
      method: request.method,
      url: request.url,
      params: request.params,
      query: request.query,
    });
  });

  // Response logging
  app.addHook('onResponse', async (request, reply) => {
    logger.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: reply.elapsedTime,
    });
  });

  // Routes
  await app.register(healthRoutes, { prefix: '/api/health' });
  await app.register(contractsRoutes, { prefix: '/api/contracts' });
  await app.register(clientsRoutes, { prefix: '/api/clients' });

  // 404 handler
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${request.method} ${request.url} not found`,
      },
    });
  });

  return app;
}
