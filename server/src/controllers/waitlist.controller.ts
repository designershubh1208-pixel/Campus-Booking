import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware.js';

const prisma = new PrismaClient();

// Get current user waitlist entries
export const getMyWaitlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const user = await prisma.user.findUnique({ where: { firebaseUid: req.user.uid } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const waitlist = await prisma.waitlistEntry.findMany({
      where: { userId: user.id },
      include: {
        slot: {
          include: { resource: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(waitlist);
  } catch (error) {
    console.error('Error in getMyWaitlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Join waitlist
export const joinWaitlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    
    const { slotId } = req.body;
    if (!slotId) { res.status(400).json({ error: 'slotId is required' }); return; }

    const user = await prisma.user.findUnique({ where: { firebaseUid: req.user.uid } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const entry = await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
        include: { bookings: { where: { status: { in: ['CONFIRMED', 'PENDING'] } } } }
      });

      if (!slot) { throw new Error('Slot not found'); }
      
      const availableCapacity = slot.capacity - slot.bookings.length;
      if (availableCapacity > 0) {
        throw new Error('Slot is not full, you can book it directly');
      }

      // Check if already booked
      const existingBooking = await tx.booking.findFirst({
        where: { userId: user.id, slotId, status: { in: ['CONFIRMED', 'PENDING'] } }
      });
      if (existingBooking) { throw new Error('You already have a booking for this slot'); }

      // Check if already on waitlist
      const existingWaitlist = await tx.waitlistEntry.findFirst({
        where: { userId: user.id, slotId, status: 'WAITING' }
      });
      if (existingWaitlist) { throw new Error('You are already on the waitlist for this slot'); }

      return tx.waitlistEntry.create({
        data: {
          userId: user.id,
          slotId,
          status: 'WAITING'
        }
      });
    });

    res.status(201).json(entry);
  } catch (error: any) {
    console.error('Error in joinWaitlist:', error);
    res.status(400).json({ error: error.message || 'Internal server error' });
  }
};

// Leave waitlist
export const leaveWaitlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({ where: { firebaseUid: req.user.uid } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const entry = await prisma.waitlistEntry.findUnique({ where: { id } });
    if (!entry) { res.status(404).json({ error: 'Waitlist entry not found' }); return; }

    if (entry.userId !== user.id && user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updatedEntry = await prisma.waitlistEntry.update({
      where: { id },
      data: { status: 'REMOVED' }
    });

    res.json(updatedEntry);
  } catch (error) {
    console.error('Error in leaveWaitlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin: Get waitlist entries
export const getWaitlistEntries = async (req: Request, res: Response): Promise<void> => {
  try {
    const entries = await prisma.waitlistEntry.findMany({
      include: {
        user: true,
        slot: { include: { resource: true } }
      },
      orderBy: [
        { slotId: 'asc' },
        { createdAt: 'asc' }
      ]
    });
    res.json(entries);
  } catch (error) {
    console.error('Error in getWaitlistEntries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin: Promote waitlisted user
export const promoteWaitlistUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string; // Waitlist entry ID

    const result = await prisma.$transaction(async (tx) => {
      const entry = await tx.waitlistEntry.findUnique({
        where: { id },
        include: { slot: { include: { bookings: { where: { status: { in: ['CONFIRMED', 'PENDING'] } } } } } }
      });

      if (!entry || entry.status !== 'WAITING') {
        throw new Error('Invalid waitlist entry');
      }

      const availableCapacity = (entry as any).slot.capacity - (entry as any).slot.bookings.length;
      if (availableCapacity <= 0) {
        throw new Error('Cannot promote: Slot is full');
      }

      // Update waitlist entry
      await tx.waitlistEntry.update({
        where: { id },
        data: { status: 'PROMOTED' }
      });

      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          userId: entry.userId,
          slotId: entry.slotId,
          status: 'CONFIRMED'
        }
      });

      return newBooking;
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error in promoteWaitlistUser:', error);
    res.status(400).json({ error: error.message || 'Internal server error' });
  }
};
