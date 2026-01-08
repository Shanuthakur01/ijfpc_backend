// src/middlewares/roleAuth.js

export function requireSiteCookie(req, res, next) {
  const siteAuthed = req.cookies?.site_authed;
  if (siteAuthed !== "true") {
    return res.status(401).json({ error: "Unauthenticated" });
  }
  next();
}

export function requireRoleCookie(...roles) {
  return (req, res, next) => {
    const role = req.cookies?.ijf_role;
    const siteAuthed = req.cookies?.site_authed;

    if (siteAuthed !== "true") {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // optional: attach for convenience
    req.ijfRole = role;

    next();
  };
}
