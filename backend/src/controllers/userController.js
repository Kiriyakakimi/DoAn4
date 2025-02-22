import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

// Cập nhật thông tin cá nhân
router.put('/update-profile', authMiddleware, async (req, res) => {
    const { introduction, securityQuestion, securityAnswer } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Cập nhật thông tin
        user.introduction = introduction || user.introduction;
        user.securityQuestion = securityQuestion || user.securityQuestion;
        user.securityAnswer = securityAnswer || user.securityAnswer;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
});
// Tìm kiếm người dùng
router.get('/search', authMiddleware, async (req, res) => {
    const { query } = req.query;

    try {
        const users = await User.find({
            $or: [
                { name: new RegExp(query, 'i') },
                { email: new RegExp(query, 'i') }
            ]
        }).select('-password');

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error searching users', error });
    }
});
// Gửi yêu cầu kết bạn
router.post('/add-friend', authMiddleware, async (req, res) => {
    const { friendId } = req.body;

    try {
        const user = await User.findById(req.user.id);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).json({ message: 'User not found' });
        // user.friendRequests.push(friendId);
        await user.save();
        res.json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending friend request', error });
    }
});
// Xem thông tin sơ bộ về người dùng
router.get('/profile/:userId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error });
    }
});
export default router;