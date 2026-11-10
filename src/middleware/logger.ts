import path from "path";
import { mkdir, appendFile } from "fs/promises";
import type { Request, Response, NextFunction } from "express";

const logDirectory = path.join(process.cwd(), "logs");
const logFile = path.join(logDirectory, "app.log");

export function logger(req: Request, res: Response, next: NextFunction) {
  res.on("finish", async () => {
    try {
      await mkdir(logDirectory, { recursive: true });

      const timestamp = new Date().toISOString();

      const logEntry = `${timestamp} ${req.method} ${req.originalUrl} ${res.statusCode}\n`;

      await appendFile(logFile, logEntry);
    } catch (error) {
      console.error("Failed to write access log:", error);
    }
  });

  next();
}
