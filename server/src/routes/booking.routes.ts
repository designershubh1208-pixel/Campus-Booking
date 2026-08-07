import { Router } from 'express';
import {
  getMyBookings,
  createBooking,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
} from '../controllers/booking.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';

const router = Router();

// User routes
router.get('/me', requireAuth, getMyBookings);
router.post('/', requireAuth, createBooking);
router.patch('/:id/cancel', requireAuth, cancelBooking);

// Admin routes (would typically be mounted under /api/admin/bookings, but for simplicity here)
router.get('/admin', requireAuth, requireAdmin, getAllBookings);
router.patch('/:id/approve', requireAuth, requireAdmin, (req, res) => {
  req.body.status = 'CONFIRMED';
  updateBookingStatus(req, res);
});
router.patch('/:id/reject', requireAuth, requireAdmin, (req, res) => {
  req.body.status = 'REJECTED';
  updateBookingStatus(req, res);
});

export default router;
