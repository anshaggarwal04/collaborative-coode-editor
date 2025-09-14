import express from "express";
import { register, login } from "../controllers/authController.js";
import validate from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validation/authValidation.js";

const router = express.Router();

// 🚫 Do NOT put authMiddleware here
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;