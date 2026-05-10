import { Router, type IRouter } from "express";
import { VerifyAdminPasswordBody, VerifyAdminPasswordResponse } from "@workspace/api-zod";
import crypto from "crypto";

const router: IRouter = Router();

router.post("/verify", async (req, res): Promise<void> => {
  const parsed = VerifyAdminPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const adminPassword = process.env["ADMIN_PASSWORD"];
  if (!adminPassword) {
    res.status(500).json({ error: "Admin password not configured" });
    return;
  }

  if (parsed.data.password !== adminPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  res.json(VerifyAdminPasswordResponse.parse({ success: true, token }));
});

export default router;
