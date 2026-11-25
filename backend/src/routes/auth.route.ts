import { Router } from "express";
import {
    register,
    login,
    logout,
    verifyAuth,
} from "../controllers/auth.controllers.js";
import { validate } from "../middleware/validate.js";
import { signUpSchema, loginSchema } from "../schemas/auth.schema.js";

const authRoute = Router();

authRoute.post("/register", validate(signUpSchema), register);
authRoute.post("/login", validate(loginSchema), login);
authRoute.post("/logout", logout);
authRoute.get("/verify", verifyAuth);

export default authRoute;
