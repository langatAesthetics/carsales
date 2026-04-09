import { ZodError } from "zod";

export const formatZodError = (error: ZodError) => {
  const errors: Record<string, string> = {};

  error.issues.forEach((err) => {
    const field = err.path[0] as string;
    errors[field] = err.message;
  });

  return errors;
};