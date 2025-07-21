import { Request, Response, NextFunction } from 'express';

// Interface d'erreur personnalisée
export interface AppError extends Error {
  statusCode?: number;
}

// Middleware de gestion des erreurs
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message || 'Une erreur est survenue',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
