// src/middlewares/auth.js
import jwt from "jsonwebtoken";

/**
 * JWT-based auth (legacy / optional)
 * Used only for routes that rely on the `auth` cookie (or Bearer token).
 * This is NOT used for the password-based role dashboard system.
 */
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
    req.role = payload.role; // e.g. "SUPER_ADMIN" | "FEE_STAFF" (if you use JWT roles)
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

/**
 * ✅ Cookie-based auth for your Role Dashboard system
 * Uses: ijf_role + site_authed cookies (non-httpOnly so Next middleware can read)
 */
export function requireSiteCookie(req, res, next) {
  const siteAuthed = req.cookies?.site_authed;
  if (siteAuthed !== "true") {
    return res.status(401).json({ error: "Unauthenticated" });
  }
  next();
}

export function requireRoleCookie(...roles) {
  return (req, res, next) => {
    const siteAuthed = req.cookies?.site_authed;
    const role = req.cookies?.ijf_role;

    if (siteAuthed !== "true") {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // optional convenience
    req.ijfRole = role;

    next();
  };
}
