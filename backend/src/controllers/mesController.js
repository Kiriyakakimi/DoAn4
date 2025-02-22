import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Message from '../models/message.js';

const router = express.Router();

// Gửi tin nhắn
router.post('/send', authMiddleware, async (req, res) => {
    const { receiverId, content } = req.body;

    try {
        const newMessage = new Message({
            sender: req.user.id,
            receiver: receiverId,
            content
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
});

// Thu hồi tin nhắn
router.post('/:messageId/recall', authMiddleware, async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);

        if (!message || message.sender.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Message not found or unauthorized' });
        }

        message.isRecalled = true;
        await message.save();

        res.json({ message: 'Message recalled' });
    } catch (error) {
        res.status(500).json({ message: 'Error recalling message', error });
    }
});

export default router;