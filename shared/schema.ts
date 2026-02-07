import { pgTable, text, serial, integer, timestamp, jsonb, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  full_name: text("full_name"),
  first_name: text("first_name"),
  last_name: text("last_name"),
  selected_year: integer("selected_year"),
  security_question: text("security_question"),
  security_answer: text("security_answer"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  year: integer("year").notNull(),
  progressData: jsonb("progress_data").notNull().default({}),
  examReadiness: jsonb("exam_readiness").default({}),
  statistics: jsonb("statistics").default({}),
  bookmarks: jsonb("bookmarks").default([]),
  weakAreas: jsonb("weak_areas").default([]),
  streakData: jsonb("streak_data").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  uniqueIndex("user_progress_user_year_idx").on(table.userId, table.year),
]);

export const quizSessions = pgTable("quiz_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  year: integer("year").notNull(),
  quizMode: text("quiz_mode").notNull(),
  questions: jsonb("questions").notNull(),
  answers: jsonb("answers").default({}),
  score: integer("score").default(0),
  totalQuestions: integer("total_questions").default(0),
  timeTaken: integer("time_taken").default(0),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
