import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all slots for a resource (Public / Student)
export const getResourceSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const resourceId = req.params.resourceId as string;
    const slots = await prisma.slot.findMany({
      where: { 
        resourceId,
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } // Only today or future slots
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ],
      include: {
        bookings: {
          where: { status: { in: ['CONFIRMED', 'PENDING'] } }
        },
        waitlistEntries: true
      }
    });

    // Map slots to include availability
    const slotsWithAvailability = slots.map((slot: any) => ({
      ...slot,
      availableCapacity: slot.capacity - slot.bookings.length,
      waitlistCount: slot.waitlistEntries.filter((w: any) => w.status === 'WAITING').length
    }));

    res.json(slotsWithAvailability);
  } catch (error) {
    console.error('Error in getResourceSlots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a slot for a resource (Admin only)
export const createSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const resourceId = req.params.resourceId as string;
    const { date, startTime, endTime, capacity } = req.body;

    if (!date || !startTime || !endTime || !capacity) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check if end time is after start time (basic string comparison works for ISO time strings)
    if (new Date(startTime) >= new Date(endTime)) {
      res.status(400).json({ error: 'End time must be after start time' });
      return;
    }

    // Prevent past slots
    if (new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))) {
      res.status(400).json({ error: 'Cannot create slots in the past' });
      return;
    }

    // Prevent duplicate exact slots
    const existingSlot = await prisma.slot.findFirst({
      where: {
        resourceId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      }
    });

    if (existingSlot) {
      res.status(400).json({ error: 'A duplicate slot already exists' });
      return;
    }

    const slot = await prisma.slot.create({
      data: {
        resourceId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity: parseInt(capacity, 10),
      }
    });

    res.status(201).json(slot);
  } catch (error) {
    console.error('Error in createSlot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a slot (Admin only)
export const updateSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { capacity } = req.body; // For simplicity, only allow updating capacity

    const slot = await prisma.slot.update({
      where: { id },
      data: { capacity: parseInt(capacity, 10) },
    });

    res.json(slot);
  } catch (error) {
    console.error('Error in updateSlot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
