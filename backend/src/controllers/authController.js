import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { loginSchema } from "../validation/authValidation.js"; // ✅ add this import

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // ⚠️ keep in .env

// 🔹 REGISTER
export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    if (err.code === "P2002") {
      const target = err.meta?.target?.[0];
      if (target === "username") {
        return res.status(400).json({ success: false, error: "Username already exists" });
      }
      if (target === "email") {
        return res.status(400).json({ success: false, error: "Email already exists" });
      }
      return res.status(400).json({ success: false, error: "Duplicate entry" });
    }
    next(err);
  }
}

// 🔹 LOGIN (username OR email + password)
export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: email ? { email } : { username },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: email ? "Invalid email" : "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Incorrect password" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Login failed" });
  }
};