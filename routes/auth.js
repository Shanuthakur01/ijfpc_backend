// src/routes/auth.js
import express from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

function getCookieOptions(req) {
  const host = (req.headers.host || "").toLowerCase(); // e.g. ijfpcapi.itjobsfactory.com
  const isIJFDomain = host.endsWith("itjobsfactory.com");

  const proto = (req.headers["x-forwarded-proto"] || "")
    .toString()
    .toLowerCase();
  const isHttps = req.secure || proto === "https";

  return {
    httpOnly: true,
    secure: isHttps, // must be true in prod
    sameSite: isIJFDomain ? "lax" : "none", // ✅ best practice now
    path: "/",
    ...(isIJFDomain ? { domain: ".itjobsfactory.com" } : {}),
  };
}

// POST /auth/login
router.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};

  const user = await User.findOne({ username: username?.toLowerCase() });
  if (!user || !user.isActive) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("auth", token, {
    ...getCookieOptions(req),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    ok: true,
    user: { id: String(user._id), name: user.name, role: user.role },
  });
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("auth", getCookieOptions(req));
  res.json({ ok: true });
});

// GET /auth/me
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("_id name role").lean();
  if (!user) return res.status(401).json({ error: "Unauthenticated" });

  res.json({
    ok: true,
    user: { id: String(user._id), name: user.name, role: user.role },
  });
});

export default router;
