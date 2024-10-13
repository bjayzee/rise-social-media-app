import { Request, Response, NextFunction } from 'express';
import Comment from '../models/comments';
import Post from '../models/posts';

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const postId = parseInt(req.params.postId, 10);
        let { content, userId } = req.body;

        if (isNaN(postId)) {
            return res.status(400).json({ message: 'Invalid post ID.' });
        }

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Content is required.' });
        }
        
        userId = parseInt(userId, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const comment = await Comment.create({ content, postId, userId });

        res.status(201).json({ message: 'Comment added successfully.', comment });
    } catch (error) {
        next(error);
    }
};