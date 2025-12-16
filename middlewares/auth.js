// src/middlewares/auth.js
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  // 1) cookie token (your current method)
  let token = req.cookies?.auth;

  // 2) fallback to Authorization header: Bearer <token>
  if (!token) {
    const h = req.headers.authorization || "";
    const m = String(h).match(/^Bearer\s+(.+)$/i);
    if (m) token = m[1];
  }

  if (!token) return res.status(401).json({ error: "Unauthenticated" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    req.role = payload.role; // "admin" | "employee" | "verifier"
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
