import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Wraps async route handlers to catch errors
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Global error handler — must be last middleware
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
    return;
  }

  const status = (err as { status?: number }).status || 500;
  const message = (err as Error).message || 'Internal Server Error';
  console.error('[Error]', err);
  res.status(status).json({ error: message });
};
