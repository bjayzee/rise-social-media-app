// import request from 'supertest';
// import { connectDB } from '../config/db'; // Import your Express server
// import User from '../models/users';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import httpStatus from 'http-status';
// import { sendResponse } from '../config/helper';

// // Mock the User model and helper function
// jest.mock('../models/users');
// jest.mock('../config/helper');

// const app = Promise.resolve(connectDB()); // Initialize your server

// // Mock Request and Response Utilities
// const mockRequest = (overrides?: Partial<Request>): Request => {
//     return {
//         body: {},
//         params: {},
//         query: {},
//         headers: {},
//         ...overrides,
//     } as Request;
// };

// const mockResponse = (): Response => {
//     const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn().mockReturnThis(),
//         send: jest.fn().mockReturnThis(),
//         // You can add more methods to mock as needed
//     };
//     return res as unknown as Response;
// };

// describe('User Authentication', () => {
//     afterEach(() => {
//         jest.clearAllMocks(); // Clear mock calls after each test
//     });

//     describe('POST /register', () => {
//         it('should register a user successfully', async () => {
//             const userData = { name: 'John Doe', email: 'john@example.com', password: 'password123' };

//             // Mocking User.findOne to return null (user does not exist)
//             (User.findOne as jest.Mock).mockResolvedValue(null);
//             (User.create as jest.Mock).mockResolvedValue({
//                 toJSON: () => ({ id: '1', name: userData.name, email: userData.email }),
//             });

//             const response = await request(app).post('/register').send(userData);

//             expect(response.status).toBe(httpStatus.CREATED);
//             expect(response.body.success).toBe(true);
//             expect(response.body.message).toBe("User registered successfully");
//             expect(response.body.data).toEqual({ id: '1', name: 'John Doe', email: 'john@example.com' });
//             expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
//             expect(User.create).toHaveBeenCalledWith({
//                 name: userData.name,
//                 email: userData.email,
//                 password: expect.any(String), // Password should be hashed
//             });
//         });

//         it('should return error if user already exists', async () => {
//             const userData = { name: 'Jane Doe', email: 'jane@example.com', password: 'password123' };

//             // Mocking User.findOne to return an existing user
//             (User.findOne as jest.Mock).mockResolvedValue({ id: '1', email: 'jane@example.com' });

//             const response = await request(app).post('/register').send(userData);

//             expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//             expect(response.body.success).toBe(false);
//             expect(response.body.message).toBe("User already exist");
//             expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
//         });

//         it('should return validation error', async () => {
//             const userData = { name: 'Jane Doe' }; // Missing email and password

//             const response = await request(app).post('/register').send(userData);

//             expect(response.status).toBe(httpStatus.BAD_REQUEST);
//             expect(response.body.success).toBe(false);
//             expect(response.body.message).toContain('input mismatched'); // Adjust based on your validation messages
//         });
//     });

//     describe('POST /login', () => {
//         it('should login a user successfully', async () => {
//             const userData = { email: 'john@example.com', password: 'password123' };

//             // Mocking User.findOne to return an existing user
//             (User.findOne as jest.Mock).mockResolvedValue({ 
//                 id: '1', 
//                 email: userData.email, 
//                 password: await bcrypt.hash(userData.password, 10) // Simulating hashed password
//             });

//             const response = await request(app).post('/login').send(userData);

//             expect(response.status).toBe(httpStatus.OK);
//             expect(response.body.success).toBe(true);
//             expect(response.body.message).toBe("login success");
//             expect(response.body.data).toHaveProperty('token'); // Check if token is generated
//             expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
//         });

//         it('should return error for invalid email', async () => {
//             const userData = { email: 'wrong@example.com', password: 'password123' };

//             // Mocking User.findOne to return null
//             (User.findOne as jest.Mock).mockResolvedValue(null);

//             const response = await request(app).post('/login').send(userData);

//             expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//             expect(response.body.success).toBe(false);
//             expect(response.body.message).toBe("Invalid email or password");
//         });

//         it('should return error for invalid password', async () => {
//             const userData = { email: 'john@example.com', password: 'wrongpassword' };

//             // Mocking User.findOne to return an existing user
//             (User.findOne as jest.Mock).mockResolvedValue({ 
//                 id: '1', 
//                 email: userData.email, 
//                 password: await bcrypt.hash('correctpassword', 10) // Simulating a different hashed password
//             });

//             const response = await request(app).post('/login').send(userData);

//             expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//             expect(response.body.success).toBe(false);
//             expect(response.body.message).toBe("Invalid email or password");
//         });

//         it('should return validation error', async () => {
//             const userData = { email: 'john@example.com' }; // Missing password

//             const response = await request(app).post('/login').send(userData);

//             expect(response.status).toBe(httpStatus.BAD_REQUEST);
//             expect(response.body.success).toBe(false);
//             expect(response.body.message).toContain('input mismatched'); // Adjust based on your validation messages
//         });
//     });

//     describe('GET /users', () => {
//         it('should fetch all users successfully', async () => {
//             const usersData = [
//                 { id: '1', name: 'John Doe', email: 'john@example.com' },
//                 { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
//             ];

//             // Mocking User.findAll to return users
//             (User.findAll as jest.Mock).mockResolvedValue(usersData);

//             const response = await request(app).get('/users');

//             expect(response.status).toBe(httpStatus.OK);
//             expect(response.body.success).toBe(true);
//             expect(response.body.message).toBe("Users fetched successfully");
//             expect(response.body.data).toEqual(usersData);
//         });

//         it('should return an error if fetching users fails', async () => {
//             // Mocking User.findAll to throw an error
//             (User.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

//             const response = await request(app).get('/users');

//             expect(response.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
//             expect(response.body.success).toBe(false);
//             expect(response.body.message).toBe("An unexpected error occured");
//         });
//     });
// });
