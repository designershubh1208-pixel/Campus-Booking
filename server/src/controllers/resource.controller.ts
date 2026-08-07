import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all active resources (Public / Student)
export const getResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const resources = await prisma.resource.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(resources);
  } catch (error) {
    console.error('Error in getResources:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single resource by ID (Public / Student)
export const getResourceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const resource = await prisma.resource.findUnique({
      where: { id },
    });
    if (!resource || !resource.isActive) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    res.json(resource);
  } catch (error) {
    console.error('Error in getResourceById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new resource (Admin only)
export const createResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, location, category } = req.body;
    
    if (!name || !location || !category) {
      res.status(400).json({ error: 'Name, location, and category are required' });
      return;
    }

    const resource = await prisma.resource.create({
      data: { name, description, location, category },
    });
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error in createResource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a resource (Admin only)
export const updateResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, description, location, category, isActive } = req.body;

    const resource = await prisma.resource.update({
      where: { id },
      data: { name, description, location, category, isActive },
    });
    res.json(resource);
  } catch (error) {
    console.error('Error in updateResource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
