import { ApiError } from '../utils/api.js';
import { isDev } from '../config/env.js';

export function notFound(_req, _res, next) {
  next(new ApiError(404, 'Route not found'));
}

export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const message = status === 500 && !isDev ? 'Internal server error' : err.message || 'Error';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message,
    details: err.details || undefined,
  });
}
