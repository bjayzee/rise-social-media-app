import { Request, Response, NextFunction } from 'express';
import Post from '../models/posts';
import User from '../models/users';
import httpStatus from 'http-status';
import { sendResponse } from '../config/helper';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const { title, content } = req.body;

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // Create post
        const post = await Post.create({ title, content, userId });

        return sendResponse(res, httpStatus.OK, true, "Post created successfully", post);
    } catch (error) {
        next(error);
    }
};

export const getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id, 10);

        const posts = await Post.findAll({ where: { userId } });

        return sendResponse(res, httpStatus.OK, true, "Posts fetched successfully", posts);
    } catch (error) {
        next(error);
    };
};

