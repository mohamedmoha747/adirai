import { validationResult } from 'express-validator';
import { ApiError } from '../utils/api.js';

export function validateRequest(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    throw new ApiError(422, 'Validation failed', details);
  }
  next();
}
