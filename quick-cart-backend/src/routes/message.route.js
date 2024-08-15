import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller.js';
import { protect } from '../middleware/authMiddleware.js';



const router = express.Router();

router.post('/send', protect, sendMessage);
router.get('/messages', protect, getMessages);

export default router;
