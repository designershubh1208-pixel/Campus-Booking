import { Router } from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
} from '../controllers/resource.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';

import slotRoutes from './slot.routes.js';

const router = Router();

// Nested router for slots
router.use('/:resourceId/slots', slotRoutes);

// Public / Student routes
router.get('/', requireAuth, getResources);
router.get('/:id', requireAuth, getResourceById);

// Admin routes
router.post('/', requireAuth, requireAdmin, createResource);
router.patch('/:id', requireAuth, requireAdmin, updateResource);

export default router;
