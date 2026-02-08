import { Router } from "express";
import fs from "fs";
import path from "path";
import { db } from "./db";
import { userProgress } from "../shared/schema";
import { eq, and } from "drizzle-orm";

let questionsCache: Record<number, any[]> = {};
let studyGuidesCache: Record<number, any[]> = {};

function loadQuestionsForYear(year: number): any[] {
  if (questionsCache[year]) return questionsCache[year];
  try {
    const filePath = path.join(process.cwd(), "data", `questions-y${year}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw);
      questionsCache[year] = Array.isArray(data) ? data : data.questions || [];
    } else {
      questionsCache[year] = [];
    }
  } catch {
    questionsCache[year] = [];
  }
  return questionsCache[year];
}

function loadStudyGuidesForYear(year: number): any[] {
  if (studyGuidesCache[year]) return studyGuidesCache[year];
  try {
    const filePath = path.join(process.cwd(), "data", `study-guides-y${year}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw);
      studyGuidesCache[year] = Array.isArray(data) ? data : data.guides || [];
    } else {
      studyGuidesCache[year] = [];
    }
  } catch {
    studyGuidesCache[year] = [];
  }
  return studyGuidesCache[year];
}

export function registerDataRoutes(router: Router) {
  router.get("/api/questions", (req, res) => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string, 10) : null;
      const section = req.query.section ? parseInt(req.query.section as string, 10) : null;

      if (year) {
        let questions = loadQuestionsForYear(year);
        if (section != null) {
          questions = questions.filter((q: any) => q.section === section || q.section === String(section));
        }
        return res.json(questions);
      }

      let all: any[] = [];
      for (let y = 1; y <= 4; y++) {
        all = all.concat(loadQuestionsForYear(y));
      }
      if (section != null) {
        all = all.filter((q: any) => q.section === section || q.section === String(section));
      }
      res.json(all);
    } catch (error) {
      console.error("Questions error:", error);
      res.status(500).json({ error: "Failed to load questions" });
    }
  });

  router.get("/api/study-guides", (req, res) => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string, 10) : null;
      const section = req.query.section as string | null;

      if (year) {
        let guides = loadStudyGuidesForYear(year);
        if (section != null) {
          guides = guides.filter((g: any) => g.section === section || g.section === parseInt(section, 10));
        }
        return res.json(guides);
      }

      let all: any[] = [];
      for (let y = 1; y <= 4; y++) {
        all = all.concat(loadStudyGuidesForYear(y));
      }
      res.json(all);
    } catch (error) {
      console.error("Study guides error:", error);
      res.status(500).json({ error: "Failed to load study guides" });
    }
  });

  router.get("/api/user-progress", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const year = req.query.year ? parseInt(req.query.year as string, 10) : null;
      if (!year) {
        return res.status(400).json({ message: "Year is required" });
      }

      const [progress] = await db.select().from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.year, year)));

      res.json(progress || {
        id: null,
        user_id: userId,
        year,
        progress_data: {},
        exam_readiness: {},
        statistics: {},
        bookmarks: [],
        weak_areas: [],
        streak_data: {},
      });
    } catch (error) {
      console.error("Get progress error:", error);
      res.status(500).json({ error: "Failed to get progress" });
    }
  });

  router.post("/api/user-progress", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { year, progress_data, exam_readiness, statistics, bookmarks, weak_areas, streak_data } = req.body;

      if (!year) {
        return res.status(400).json({ message: "Year is required" });
      }

      const existing = await db.select().from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.year, year)));

      let result;
      if (existing.length > 0) {
        [result] = await db.update(userProgress)
          .set({
            progressData: progress_data ?? existing[0].progressData,
            examReadiness: exam_readiness ?? existing[0].examReadiness,
            statistics: statistics ?? existing[0].statistics,
            bookmarks: bookmarks ?? existing[0].bookmarks,
            weakAreas: weak_areas ?? existing[0].weakAreas,
            streakData: streak_data ?? existing[0].streakData,
            updatedAt: new Date(),
          })
          .where(and(eq(userProgress.userId, userId), eq(userProgress.year, year)))
          .returning();
      } else {
        [result] = await db.insert(userProgress).values({
          userId,
          year,
          progressData: progress_data || {},
          examReadiness: exam_readiness || {},
          statistics: statistics || {},
          bookmarks: bookmarks || [],
          weakAreas: weak_areas || [],
          streakData: streak_data || {},
        }).returning();
      }

      res.json(result);
    } catch (error) {
      console.error("Save progress error:", error);
      res.status(500).json({ error: "Failed to save progress" });
    }
  });

  router.delete("/api/user-progress", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const year = req.query.year ? parseInt(req.query.year as string, 10) : null;

      if (year) {
        await db.delete(userProgress)
          .where(and(eq(userProgress.userId, userId), eq(userProgress.year, year)));
      } else {
        await db.delete(userProgress).where(eq(userProgress.userId, userId));
      }

      res.json({ message: "Progress reset" });
    } catch (error) {
      console.error("Delete progress error:", error);
      res.status(500).json({ error: "Failed to delete progress" });
    }
  });
}
