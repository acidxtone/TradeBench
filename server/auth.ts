import { Router } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { db } from "./db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 12;

export function registerAuthRoutes(router: Router) {
  router.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, full_name, security_question, security_answer } = req.body;

      if (!email || !password || !full_name) {
        return res.status(400).json({ message: "Email, password, and full name are required" });
      }

      const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      if (existing.length > 0) {
        return res.status(409).json({ message: "An account with this email already exists" });
      }

      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      const nameParts = full_name.trim().split(/\s+/);
      const first_name = nameParts[0] || "";
      const last_name = nameParts.slice(1).join(" ") || "";

      let security_answer_hash = null;
      if (security_answer) {
        security_answer_hash = await bcrypt.hash(security_answer.toLowerCase().trim(), SALT_ROUNDS);
      }

      const [newUser] = await db.insert(users).values({
        email: email.toLowerCase(),
        password_hash,
        full_name,
        first_name,
        last_name,
        security_question: security_question || null,
        security_answer: security_answer_hash,
      }).returning();

      (req.session as any).userId = newUser.id;

      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        selected_year: newUser.selected_year,
      });
    } catch (error: any) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  router.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      (req.session as any).userId = user.id;

      res.json({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        first_name: user.first_name,
        last_name: user.last_name,
        selected_year: user.selected_year,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  router.get("/api/auth/user", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        first_name: user.first_name,
        last_name: user.last_name,
        selected_year: user.selected_year,
      });
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  router.patch("/api/auth/user", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { selected_year } = req.body;

      const [updated] = await db.update(users)
        .set({ selected_year, updated_at: new Date() })
        .where(eq(users.id, userId))
        .returning();

      res.json({
        id: updated.id,
        email: updated.email,
        full_name: updated.full_name,
        first_name: updated.first_name,
        last_name: updated.last_name,
        selected_year: updated.selected_year,
      });
    } catch (error: any) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  router.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });

  router.post("/api/auth/forgot-password/verify-email", async (req, res) => {
    try {
      const { email } = req.body;
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));

      if (!user || !user.security_question) {
        return res.status(404).json({ message: "Account not found or no security question set" });
      }

      res.json({ security_question: user.security_question });
    } catch (error: any) {
      console.error("Verify email error:", error);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });

  router.post("/api/auth/forgot-password/verify-answer", async (req, res) => {
    try {
      const { email, security_answer } = req.body;
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));

      if (!user || !user.security_answer) {
        return res.status(404).json({ message: "Account not found" });
      }

      const valid = await bcrypt.compare(security_answer.toLowerCase().trim(), user.security_answer);
      if (!valid) {
        return res.status(401).json({ message: "Incorrect answer" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      (req.session as any).resetToken = resetToken;
      (req.session as any).resetUserId = user.id;

      res.json({ reset_token: resetToken });
    } catch (error: any) {
      console.error("Verify answer error:", error);
      res.status(500).json({ message: "Failed to verify answer" });
    }
  });

  router.post("/api/auth/forgot-password/reset", async (req, res) => {
    try {
      const { reset_token, new_password } = req.body;
      const sessionToken = (req.session as any)?.resetToken;
      const resetUserId = (req.session as any)?.resetUserId;

      if (!sessionToken || !resetUserId || sessionToken !== reset_token) {
        return res.status(401).json({ message: "Invalid or expired reset token" });
      }

      const password_hash = await bcrypt.hash(new_password, SALT_ROUNDS);
      await db.update(users)
        .set({ password_hash, updated_at: new Date() })
        .where(eq(users.id, resetUserId));

      delete (req.session as any).resetToken;
      delete (req.session as any).resetUserId;

      res.json({ message: "Password reset successfully" });
    } catch (error: any) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });
}
