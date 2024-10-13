import { Router } from 'express';
import { createUser, getUsers, login } from '../controllers/users';
import { createPost, getUserPosts } from '../controllers/posts';
import { addComment } from '../controllers/comments';
import { isAuthenticated } from '../middlewares/auth';

export default (router: Router) => {
    router.post('/auth/register', createUser);
    router.post('/auth/login', login);
    router.get('/users', isAuthenticated, getUsers);
    router.post('/users/:id/posts', isAuthenticated, createPost);
    router.get('/users/:id/posts', isAuthenticated, getUserPosts);
    router.post('/posts/:postId/comments', isAuthenticated, addComment);
}
