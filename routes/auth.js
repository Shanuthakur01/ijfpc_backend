// src/routes/auth.js
import express from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import RoleSetting from "../models/RoleSetting.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// -------------------- Cookie Helpers --------------------
function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true, // JWT cookie (if you still use /login)
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

// ✅ non-httpOnly cookie (client + next middleware can read)
function roleCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

// ✅ Cookie-based SUPER_ADMIN protection (NO requireAuth needed)
function requireSuperAdminCookie(req, res, next) {
  const role = req.cookies?.ijf_role;
  const siteAuthed = req.cookies?.site_authed;

  if (!siteAuthed) return res.status(401).json({ error: "Unauthenticated" });
  if (role !== "SUPER_ADMIN")
    return res.status(403).json({ error: "Forbidden" });

  next();
}

// ---------------------------
// Existing: POST /api/auth/login  (optional / legacy)
// ---------------------------
router.post("/login", loginLimiter, async (req, res) => {
  try {
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

    res.cookie("auth", token, cookieOptions());

    res.json({
      ok: true,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (e) {
    console.error("login error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------------
// ✅ POST /api/auth/role-login  (YOUR MAIN LOGIN FLOW)
// ---------------------------
router.post("/role-login", loginLimiter, async (req, res) => {
  try {
    const { password } = req.body || {};
    const p = String(password || "").trim();

    if (!p || p.length < 2) {
      return res.status(400).json({ error: "Password is required" });
    }

    // ✅ 1) Main site password => SUPER_ADMIN
    if (process.env.SITE_PASSWORD && p === String(process.env.SITE_PASSWORD)) {
      res.cookie("ijf_role", "SUPER_ADMIN", roleCookieOptions());
      res.cookie("site_authed", "true", roleCookieOptions());
      res.cookie("fee_authed", "true", roleCookieOptions());
      return res.json({ ok: true, role: "SUPER_ADMIN", enabled: true });
    }

    // ✅ 2) Otherwise match role passwords stored in DB
    const roleDoc = await RoleSetting.findOne({ passwordPlain: p }).lean();

    if (!roleDoc) {
      return res.status(401).json({ error: "Invalid role password" });
    }

    if (!roleDoc.enabled) {
      return res.status(403).json({ error: "Role is disabled" });
    }

    res.cookie("ijf_role", roleDoc.roleName, roleCookieOptions());
    res.cookie("site_authed", "true", roleCookieOptions());

    // ✅ fee-dashboard cookie access (adjust if your logic differs)
    const needsFeeCookie =
      roleDoc.roleName === "FEE_STAFF" || roleDoc.roleName === "FOUNDER";

    if (needsFeeCookie) {
      res.cookie("fee_authed", "true", roleCookieOptions());
    } else {
      // clear using SAME attributes as set
      res.clearCookie("fee_authed", roleCookieOptions());
    }

    return res.json({ ok: true, role: roleDoc.roleName, enabled: true });
  } catch (e) {
    console.error("role-login error:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

// ---------------------------
// ✅ POST /api/auth/seed-roles  (FIXED: cookie-based SUPER_ADMIN auth)
// ---------------------------
router.post("/seed-roles", requireSuperAdminCookie, async (req, res) => {
  try {
    const defaults = [
      {
        roleName: "FEE_STAFF",
        passwordPlain: String(process.env.FEE_DASHBOARD_PASSWORD || "fee@1234"),
        enabled: true,
      },
      {
        roleName: "PLACEMENT_STAFF",
        passwordPlain: String(
          process.env.PLACEMENT_DASHBOARD_PASSWORD || "placement@1234"
        ),
        enabled: true,
      },
      {
        roleName: "FOUNDER",
        passwordPlain: String(
          process.env.FOUNDER_DASHBOARD_PASSWORD ||
            process.env.SITE_PASSWORD ||
            "founder@1234"
        ),
        enabled: true,
      },
    ];

    for (const r of defaults) {
      await RoleSetting.updateOne(
        { roleName: r.roleName },
        {
          $set: {
            passwordPlain: r.passwordPlain,
            enabled: r.enabled,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
    }

    const roles = await RoleSetting.find({})
      .select("roleName passwordPlain enabled updatedAt")
      .sort({ roleName: 1 })
      .lean();

    return res.json({ ok: true, roles });
  } catch (e) {
    console.error("seed-roles error:", e);
    return res.status(500).json({ error: "Failed to seed roles" });
  }
});

// ---------------------------
// ✅ GET /api/auth/role-settings  (FIXED: cookie-based SUPER_ADMIN auth)
// ---------------------------
router.get("/role-settings", requireSuperAdminCookie, async (req, res) => {
  try {
    const roles = await RoleSetting.find({})
      .select("roleName passwordPlain enabled updatedAt")
      .sort({ roleName: 1 })
      .lean();

    res.json({ ok: true, roles });
  } catch (e) {
    console.error("role-settings error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------------
// ✅ PUT /api/auth/role-settings/:roleName  (FIXED: cookie-based SUPER_ADMIN auth)
// ---------------------------
router.put(
  "/role-settings/:roleName",
  requireSuperAdminCookie,
  async (req, res) => {
    try {
      const { roleName } = req.params;
      const { passwordPlain, enabled } = req.body || {};

      const update = { updatedAt: new Date() };
      if (typeof enabled === "boolean") update.enabled = enabled;
      if (
        typeof passwordPlain === "string" &&
        passwordPlain.trim().length >= 4
      ) {
        update.passwordPlain = passwordPlain.trim();
      }

      const doc = await RoleSetting.findOneAndUpdate(
        { roleName },
        { $set: update },
        { new: true }
      ).lean();

      if (!doc) return res.status(404).json({ error: "Role not found" });

      res.json({
        ok: true,
        role: {
          roleName: doc.roleName,
          passwordPlain: doc.passwordPlain,
          enabled: doc.enabled,
          updatedAt: doc.updatedAt,
        },
      });
    } catch (e) {
      console.error("update role-settings error:", e);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ---------------------------
// ✅ POST /api/auth/logout  (FIXED: clear cookies with matching options)
// ---------------------------
router.post("/logout", (_req, res) => {
  // clear role cookies (must match attributes)
  const roleOpts = roleCookieOptions();
  res.clearCookie("ijf_role", roleOpts);
  res.clearCookie("site_authed", roleOpts);
  res.clearCookie("fee_authed", roleOpts);

  // clear auth cookie (only relevant if you still use /login)
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("auth", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  res.json({ ok: true });
});

// ---------------------------
// Optional: GET /api/auth/me
// Note: This still relies on /login + JWT. If you don't use /login, you can remove this.
// ---------------------------
router.get("/me", async (req, res) => {
  // If JWT auth is not used, return cookie-based identity instead.
  const role = req.cookies?.ijf_role || null;
  const siteAuthed = req.cookies?.site_authed === "true";

  if (!siteAuthed || !role) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  res.json({
    ok: true,
    user: { id: null, name: null, role },
  });
});

export default router;
