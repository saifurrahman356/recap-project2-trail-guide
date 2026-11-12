import express from "express";
import path from "node:path";
import nunjucks from "nunjucks";
import { logger } from "./middleware/logger";

import { connectDB, closeDB } from "./models/db";
import websiteRoutes from "./routes/websiteRoutes";
import adminRoutes from "./routes/adminRoutes";
import apiRoutes from "./routes/apiRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const viewDir = path.resolve("views");
const publicDir = path.resolve("public");

nunjucks.configure(viewDir, { autoescape: true, express: app, watch: true });
app.set("view engine", "html");
app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(logger);

app.use("/", websiteRoutes);
app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);

connectDB()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT. Closing database and exiting...");
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Closing database and exiting...");
  await closeDB();
  process.exit(0);
});
