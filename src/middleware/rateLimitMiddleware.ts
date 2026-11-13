import { Request, Response, NextFunction } from "express";

const RATE_LIMIT_WINDOW_MS = 1 * 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // Max requests per window

const requestCountMap = new Map<string, { count: number; resettime: number }>();

export const rateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const writeMethods = ["POST", "PUT", "PATCH", "DELETE"];

  if (!writeMethods.includes(req.method)) {
    return next();
  }

  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return res.status(401).json({ error: "API key invalid" });
  }

  const now = Date.now();

  const current = requestCountMap.get(apiKey);

  if (!current || now > current.resettime) {
    requestCountMap.set(apiKey, {
      count: 1,
      resettime: now + +RATE_LIMIT_WINDOW_MS,
    });

    return next();
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      error: "Too many requests. Maximum 5 write requests per minute.",
    });
  }

  current.count++;

  next();
};
