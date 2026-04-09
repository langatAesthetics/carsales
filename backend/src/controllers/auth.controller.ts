import { Request, Response, NextFunction } from "express";
import { loginAdmin } from "../services/auth.service";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const result = await loginAdmin(email, password);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};