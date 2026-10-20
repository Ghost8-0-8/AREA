import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../user-service/userModel';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { authenticateJWT } from './authMiddleware';

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export default {
    login: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
            if (!user || !user.password) {
                return res.status(404).json({
                    success: false,
                    error: "User not found or password is missing",
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid credentials",
                });
            }

            const token = jwt.sign({ id: user._id }, SECRET_KEY as string, { expiresIn: '24h' });
            return res.status(200).json({
                success: true,
                token,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    },

    register: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email: email.toLowerCase() });
            if (user) {
                return res.status(409).json({
                    success: false,
                    error: "User already exists",
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                email: email.toLowerCase(),
                password: hashedPassword,
                name: {
                    first: req.body.firstName,
                    last: req.body.lastName,
                },
            });
            await newUser.save();

            return res.status(201).json({
                success: true,
                message: "User created successfully",
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    },

    getUserInfo: [authenticateJWT, async (req: Request, res: Response): Promise<Response> => {
        try {
            const user = (req as any).user;

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: "Unauthorized",
                });
            }

            const userId = user._id;
            const userInfo = await UserModel.findById(userId).select('-password');

            if (!userInfo) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }

            return res.status(200).json({
                success: true,
                user: userInfo,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    }],

    forgotPassword: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email } = req.body;
            const user = await UserModel.findOne({ email: email.toLowerCase() });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = Date.now() + 3600000;

            user.resetPasswordToken = resetToken;
            user.resetPasswordExpiry = resetTokenExpiry;
            await user.save();

            const resetUrl = `http://localhost:8081/reset-password/${resetToken}`;

            const mailOptions = {
                from: EMAIL_USER,
                to: user.email,
                subject: 'Password Reset Request',
                text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}`,
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({
                success: true,
                message: "Password reset email sent",
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    },

    resetPassword: async (req: Request, res: Response): Promise<Response> => {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;
            const user = await UserModel.findOne({
                resetPasswordToken: token,
                resetPasswordExpiry: { $gt: Date.now() },
            });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid or expired token",
                });
            }

            user.password = await bcrypt.hash(newPassword, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpiry = undefined;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Password reset successfully",
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    },
};