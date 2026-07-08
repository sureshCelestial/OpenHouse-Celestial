import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    if (env.LOG_LEVEL === 'debug' || (level === 'warn' && ['warn', 'error', 'info'].includes(env.LOG_LEVEL)) || (level === 'info' && ['info', 'debug'].includes(env.LOG_LEVEL))) {
      console.log(`[${level.toUpperCase()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
}
