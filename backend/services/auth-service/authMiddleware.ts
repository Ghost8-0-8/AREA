import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../user-service/userModel';

function isTokenBlacklisted(token: string): boolean {
    return false;
}

export async function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    if (isTokenBlacklisted(token)) {
        return res.status(403).json({ message: 'Token blacklisted' });
    }

    jwt.verify(token, process.env.SECRET_KEY!, async (err, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }

        try {
            const user = await UserModel.findById(decoded.id).exec();
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            (req as any).user = user;
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
}

export async function optionalAuthenticateJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return next();
    }

    if (isTokenBlacklisted(token)) {
        return res.status(403).json({ message: 'Token blacklisted' });
    }

    jwt.verify(token, process.env.SECRET_KEY!, async (err, decoded: any) => {
        if (err) {
            return next();
        }

        try {
            const user = await UserModel.findById(decoded.id).exec();
            if (user) {
                (req as any).user = user;
            }
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
}
