import { Router } from 'express';
import {
  getMyWaitlist,
  joinWaitlist,
  leaveWaitlist,
  getWaitlistEntries,
  promoteWaitlistUser
} from '../controllers/waitlist.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';

const router = Router();

// User routes
router.get('/me', requireAuth, getMyWaitlist);
router.post('/', requireAuth, joinWaitlist);
router.delete('/:id', requireAuth, leaveWaitlist);

// Admin routes (would typically be under /api/admin/waitlist, but mounted similarly)
router.get('/admin', requireAuth, requireAdmin, getWaitlistEntries);
router.patch('/:id/promote', requireAuth, requireAdmin, promoteWaitlistUser);

export default router;
