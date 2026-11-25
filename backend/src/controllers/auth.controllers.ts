import { type Request, type Response, type NextFunction } from "express";
import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

// JWT secret is required — never fall back to a committed constant.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error(
        "JWT_SECRET env var is required. Set it in Render (or your local .env) before starting the server.",
    );
}

const IS_PROD = process.env.NODE_ENV === "production";

// Centralized cookie options so login/logout/register stay in sync.
// Over http:// locally the browser refuses Secure cookies, so we only turn
// Secure + SameSite=none on in production.
const cookieOptions = () => ({
    httpOnly: true,
    secure: IS_PROD,
    sameSite: (IS_PROD ? "none" : "lax") as "none" | "lax",
    path: "/",
});

const signToken = (payload: object) =>
    jwt.sign(payload, JWT_SECRET as string, {
        expiresIn: "7d",
    } satisfies SignOptions);

const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "Email already exists",
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        // Auto-login: issue the JWT and set the cookie so the user is signed
        // in immediately after registering.
        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        res.cookie("auth_token", token, {
            ...cookieOptions(),
            maxAge: AUTH_COOKIE_MAX_AGE,
        });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        // Same message for both branches to prevent user enumeration.
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }

        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        res.cookie("auth_token", token, {
            ...cookieOptions(),
            maxAge: AUTH_COOKIE_MAX_AGE,
        });

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            message: "Login successful",
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const logout = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Use the exact same cookie options as when we set it, otherwise the
        // browser will not match and clear the right cookie.
        res.cookie("auth_token", "", {
            ...cookieOptions(),
            maxAge: 0,
        });

        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error: unknown) {
        next(error);
    }
};

export const verifyAuth = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.cookies?.auth_token;

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET as string) as {
            userId: string;
            email: string;
            role: string;
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, email: true, role: true },
        });

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        res.status(200).json({ success: true, user });
    } catch (error: unknown) {
        const name = (error as { name?: string })?.name;
        if (name === "JsonWebTokenError") {
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return;
        }
        if (name === "TokenExpiredError") {
            res.status(401).json({
                success: false,
                message: "Token expired",
            });
            return;
        }
        next(error);
    }
};
