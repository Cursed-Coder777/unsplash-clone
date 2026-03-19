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
        // explain above line: This line generates a JWT token using the jsonwebtoken library. It takes three arguments:
        // 1. Payload: An object containing the userId, which will be encoded in the token.
        // 2. Secret Key: The secret key used to sign the token, retrieved from environment variables (process.env.JWT_SECRET). The 'as string' is a TypeScript type assertion to ensure that the value is treated as a string.
        // 3. Options: An object specifying additional options for the token, in this case, setting an expiration time of 7 days (expiresIn: '7d').
    );
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
        return null;
    }
};