import express from "express";
import { createServer } from "http";
import session from "express-session";
import connectPg from "connect-pg-simple";
import authRouter from "./auth";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pgStore = connectPg(session);
const sessionStore = new pgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: false,
  tableName: "sessions",
});

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

app.use(authRouter);

(async () => {
  const server = createServer(app);

  if (process.env.NODE_ENV === "production") {
    const { serveStatic } = await import("./vite");
    await serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  }

  const port = 5000;
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
})();
