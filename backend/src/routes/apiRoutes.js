import express from 'express';
import authRoutes from '../controllers/authController.js';
import userRoutes from '../controllers/userController.js';
import postRoutes from '../controllers/postController.js';
import groupRoutes from '../controllers/groupController.js';
import messageRoutes from '../controllers/mesController.js';
import notifiRoutes from '../controllers/notifiController.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/groups', groupRoutes);
router.use('/messages', messageRoutes);
router.use('/notifications', notifiRoutes);

export default router;