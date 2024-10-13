import { Request, Response } from "express";
import User from "../models/users";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { sendResponse } from "../config/helper";
import { loginValidation, registerValidattion } from "../config/validations";


export const createUser = async (req: Request, res: Response) => {

    try {
        const { error } = await registerValidattion.validateAsync(req.body);
        if (error) {
            return sendResponse(res, httpStatus.BAD_REQUEST, false, error.message)
        }
        const { name, email } = req.body;

        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return sendResponse(res, httpStatus.UNAUTHORIZED, false, "User already exist");
        }


        const hashedPassword = await bcrypt.hash(req.body?.password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        const { password, ...userRes } = user.toJSON();

        return sendResponse(res, httpStatus.CREATED, true, "User registered successfully", userRes);
    } catch (error) {
        // console.log(error)
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error occurred");
    }
}

export const login = async (req: Request, res: Response) => {
    try {

        const { error } = await loginValidation.validateAsync(req.body);

        if (error) {
            return sendResponse(res, httpStatus.BAD_REQUEST, false, "input mismatched");
        }

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return sendResponse(res, httpStatus.UNAUTHORIZED, false, "Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendResponse(res, httpStatus.UNAUTHORIZED, false, "Invalid email or password");
        }

        // Generate JWT token
        const JWT_SECRET = process.env.JWT_SECRET as string;
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        const foundUser = {
            email: user.email,
            name: user.name,
            token: token,
            id: user.id
        }

        return sendResponse(res, httpStatus.OK, true, "login success", foundUser);
    } catch (error) {
        console.log(error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error occured");
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
        });

        return sendResponse(res, httpStatus.OK, true, "Users fetched successfully", users);
    } catch (error) {
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, "An unexpected error occured");
    }
};