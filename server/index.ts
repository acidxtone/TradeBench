import express from "express";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { setupVite } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
  await setupAuth(app);
  registerAuthRoutes(app);

  if (process.env.NODE_ENV === "production") {
    const { serveStatic } = await import("./vite");
    serveStatic(app);
  } else {
    await setupVite(app);
  }

  const port = 5000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
})();
