import type { Request, Response, NextFunction } from "express";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "grizli2024";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.header("x-admin-password") ?? "";
  const bearer = (req.header("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const provided = header || bearer;
  if (provided && provided === ADMIN_PASSWORD) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
}
