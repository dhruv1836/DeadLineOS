import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Extend Express Request so TypeScript recognizes req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'deadlineos-ai',
  });
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { id: decodedToken.uid, email: decodedToken.email };
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};