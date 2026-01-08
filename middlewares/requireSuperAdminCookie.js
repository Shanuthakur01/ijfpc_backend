export function requireSuperAdmin(req, res, next) {
  // Allow if JWT auth exists
  if (req.userId) return next();

  // Allow if role-login cookie exists
  const role = req.cookies?.ijf_role;
  if (role === "SUPER_ADMIN") return next();

  return res.status(401).json({ error: "Unauthenticated" });
}
// src/middlewares/requireSuperAdminCookie.js
export function requireSuperAdminCookie(req, res, next) {
  const role = req.cookies?.ijf_role;

  if (role === "SUPER_ADMIN") return next();

  return res.status(401).json({ error: "Unauthenticated" });
}
