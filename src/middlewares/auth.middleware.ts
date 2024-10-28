import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Request as ExpressRequest } from 'express'; 
import { User } from '../models/user.model';

interface AuthenticatedRequest extends ExpressRequest {
  user?: User; 
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado: Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Acesso negado: Token inválido' });
  }
};