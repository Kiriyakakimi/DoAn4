import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Loại bỏ password
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
});

export default router;
