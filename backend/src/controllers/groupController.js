import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Group from '../models/group.js';
import Message from '../models/message.js';

const router = express.Router();

// Tạo nhóm nhắn tin
router.post('/create', authMiddleware, async (req, res) => {
    const { name, memberIds } = req.body;

    try {
        const newGroup = new Group({
            name,
            members: [req.user.id, ...memberIds]
        });

        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ message: 'Error creating group', error });
    }
});
// Gửi tin nhắn nhóm
router.post('/:groupId/send-message', authMiddleware, async (req, res) => {
    const { content } = req.body;

    try {
        const group = await Group.findById(req.params.groupId);
        if (!group || !group.members.includes(req.user.id)) {
            return res.status(404).json({ message: 'Group not found or unauthorized' });
        }

        const newMessage = new Message({
            sender: req.user.id,
            content
        });

        await newMessage.save();
        group.messages.push(newMessage._id);
        await group.save();

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error sending group message', error });
    }
});

// Thu hồi tin nhắn nhóm
router.post('/:groupId/recall-message/:messageId', authMiddleware, async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        const message = await Message.findById(req.params.messageId);

        if (!group || !message || message.sender.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Group or message not found or unauthorized' });
        }

        message.isRecalled = true;
        await message.save();

        res.json({ message: 'Group message recalled' });
    } catch (error) {
        res.status(500).json({ message: 'Error recalling group message', error });
    }
});

// Tắt thông báo nhóm
router.post('/:groupId/toggle-notification', authMiddleware, async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);
        if (!group || !group.members.includes(req.user.id)) {
            return res.status(404).json({ message: 'Group not found or unauthorized' });
        }
        res.json({ message: 'Group notification setting updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating group notification setting', error });
    }
});
export default router;