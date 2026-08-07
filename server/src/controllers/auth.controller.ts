import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware.js';

const prisma = new PrismaClient();

export const registerOrLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { uid, email } = req.user;
    const { name, role } = req.body || {}; // Passed during registration

    let user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    if (!user) {
      // Create new user
      if (!name) {
        res.status(400).json({ error: 'Name is required for registration' });
        return;
      }
      user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          email,
          name,
          role: role === 'ADMIN' ? 'ADMIN' : 'STUDENT',
        },
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error in registerOrLogin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid: req.user.uid },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
