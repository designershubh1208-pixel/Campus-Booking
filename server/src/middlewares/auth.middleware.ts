import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import '../firebase.js';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // MOCK AUTHENTICATION LAYER
    // Expected token format for mock: "mock_<uid>_<email>"
    if (token.startsWith('mock_')) {
      const parts = token.split('_');
      if (parts.length >= 3) {
        req.user = {
          uid: parts[1],
          email: parts.slice(2).join('_'), // In case email has underscores
        };
        next();
        return;
      }
    }
    
    // Fallback to real Firebase Auth if a real token is provided (once configured)
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
    };
    next();
  } catch (error) {
    console.error('Error verifying auth token', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
