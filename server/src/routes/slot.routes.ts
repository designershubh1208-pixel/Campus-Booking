import { Router } from 'express';
import {
  getResourceSlots,
  createSlot,
  updateSlot,
} from '../controllers/slot.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';

const router = Router({ mergeParams: true }); // to access resourceId from parent router

// Public / Student routes
router.get('/resource/:resourceId', requireAuth, getResourceSlots);

// Admin routes
router.post('/resource/:resourceId', requireAuth, requireAdmin, createSlot);
router.patch('/:id', requireAuth, requireAdmin, updateSlot);

export default router;
