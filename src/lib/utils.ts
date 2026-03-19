import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};
export const generateToken = (userId: string) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET as string,  // 👈 Type assertion
        { expiresIn: '7d' }
    );
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
        return null;
    }
};