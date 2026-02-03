import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError, ValidationError } from './app-error.js';
import { logger } from '../../config/logger.js';
import { ZodError } from 'zod';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function errorHandler(
  error: FastifyError | AppError | ZodError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  logger.error({
    err: error,
    url: request.url,
    method: request.method,
  });

  // Zod validation error
  if (error instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.flatten().fieldErrors,
      },
    };
    reply.status(400).send(response);
    return;
  }

  // Custom AppError
  if (error instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error instanceof ValidationError ? error.errors : undefined,
      },
    };
    reply.status(error.statusCode).send(response);
    return;
  }

  // Fastify validation error
  if (error.validation) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.validation,
      },
    };
    reply.status(400).send(response);
    return;
  }

  // Generic error
  const response: ErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : error.message,
    },
  };
  reply.status(500).send(response);
}
