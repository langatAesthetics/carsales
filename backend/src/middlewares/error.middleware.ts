import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { formatZodError } from "../utils/formatZodError";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 Error:", err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: formatZodError(err),
    });
  }

  // Handle custom errors (future use)
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // Default fallback
  return res.status(500).json({
    message: "Internal Server Error",
  });
};