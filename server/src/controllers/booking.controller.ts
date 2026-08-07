import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware.js';

const prisma = new PrismaClient();

// Get current user bookings
export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }

    const user = await prisma.user.findUnique({ where: { firebaseUid: req.user.uid } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        slot: {
          include: { resource: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error in getMyBookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a booking
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    
    const { slotId } = req.body;
    if (!slotId) { res.status(400).json({ error: 'slotId is required' }); return; }

    const user = await prisma.user.findUnique({ where: { firebaseUid: req.user.uid } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    // Use transaction to prevent overbooking
    const booking = await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
        include: { bookings: { where: { status: { in: ['CONFIRMED', 'PENDING'] } } } }
      });

      if (!slot) { throw new Error('Slot not found'); }
      if (new Date(slot.date) < new Date(new Date().setHours(0, 0, 0, 0))) {
        throw new Error('Cannot book past slots');
      }

      // Check if user already booked this slot
      const existingBooking = await tx.booking.findFirst({
        where: { userId: user.id, slotId, status: { in: ['CONFIRMED', 'PENDING'] } }
      });

      if (existingBooking) {
        throw new Error('You already have an active booking for this slot');
      }

      const availableCapacity = slot.capacity - slot.bookings.length;
      if (availableCapacity <= 0) {
        throw new Error('Slot is fully booked');
      }

      // Create booking
      return tx.booking.create({
        data: {
          userId: user.id,
          slotId,
          status: 'PENDING' // PRD says pending approval or confirmed? Usually CONFIRMED if capacity available, but PRD says PENDING is waiting for admin approval. Let's make it PENDING so admin can approve it.
        }
      });
    });

    res.status(201).json(booking);
  } catch (error: any) {
    console.error('Error in createBooking:', error);
    res.status(400).json({ error: error.message || 'Internal server error' });
  }
};

// Cancel a booking (User can cancel their own)
export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({ where: { firebaseUid: req.user.uid } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) { res.status(404).json({ error: 'Booking not found' }); return; }

    if (booking.userId !== user.id && user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden: You can only cancel your own bookings' });
      return;
    }

    const updatedBooking = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });

      // Auto-promote next user in waitlist
      const nextInLine = await tx.waitlistEntry.findFirst({
        where: { slotId: b.slotId, status: 'WAITING' },
        orderBy: { position: 'asc' }
      });

      if (nextInLine) {
        await tx.waitlistEntry.update({
          where: { id: nextInLine.id },
          data: { status: 'PROMOTED' }
        });
        
        await tx.booking.create({
          data: {
            userId: nextInLine.userId,
            slotId: b.slotId,
            status: 'PENDING'
          }
        });
      }

      return b;
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin: Get all bookings
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        slot: { include: { resource: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin: Approve/Reject booking
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body; // 'CONFIRMED' or 'REJECTED'

    if (status !== 'CONFIRMED' && status !== 'REJECTED') {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const booking = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id },
        data: { status }
      });

      // If rejected, auto-promote next in line
      if (status === 'REJECTED') {
        const nextInLine = await tx.waitlistEntry.findFirst({
          where: { slotId: b.slotId, status: 'WAITING' },
          orderBy: { position: 'asc' }
        });

        if (nextInLine) {
          await tx.waitlistEntry.update({
            where: { id: nextInLine.id },
            data: { status: 'PROMOTED' }
          });
          
          await tx.booking.create({
            data: {
              userId: nextInLine.userId,
              slotId: b.slotId,
              status: 'PENDING'
            }
          });
        }
      }

      return b;
    });

    res.json(booking);
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
