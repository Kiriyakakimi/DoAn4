import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js'

const router = express.Router();

// Đăng bài
router.post('/create', authMiddleware, async (req, res) => {
    const { content } = req.body;

    try {
        const newPost = new Post({
            author: req.user.id,
            content
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
});
// Like bài viết
router.post('/:postId/like', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (!post.likes.includes(req.user.id)) {
            post.likes.push(req.user.id);
            await post.save();
        }

        res.json({ message: 'Post liked' });
    } catch (error) {
        res.status(500).json({ message: 'Error liking post', error });
    }
});

// Share bài viết
router.post('/:postId/share', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (!post.shares.includes(req.user.id)) {
            post.shares.push(req.user.id);
            await post.save();
        }

        res.json({ message: 'Post shared' });
    } catch (error) {
        res.status(500).json({ message: 'Error sharing post', error });
    }
});
router.post('/:postId/comment', authMiddleware, async (req, res) => {
    const { content } = req.body;

    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const newComment = new Comment({
            author: req.user.id,
            post: req.params.postId,
            content
        });

        await newComment.save();
        post.comments.push(newComment._id);
        await post.save();

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: 'Error commenting on post', error });
    }
});

export default router;