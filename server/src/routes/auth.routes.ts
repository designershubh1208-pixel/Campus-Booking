import { Router } from 'express';
import { registerOrLogin, getMe } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// In Firebase, registering and logging in often just means syncing the user 
// with our database after the frontend gets the token.
router.post('/sync', requireAuth, registerOrLogin);
router.get('/me', requireAuth, getMe);

export default router;
