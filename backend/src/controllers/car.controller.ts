import { Request, Response, NextFunction } from "express";
import { createCar, getCars } from "../services/car.service";

export const createCarController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const car = await createCar(req.body, req.user.id);
    res.status(201).json(car);
  } catch (error) {
    next(error);
  }
};

export const getCarsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = {
      brand: req.query.brand as string,
      year: req.query.year ? Number(req.query.year) : undefined,
      minPrice: req.query.minPrice
        ? Number(req.query.minPrice)
        : undefined,
      maxPrice: req.query.maxPrice
        ? Number(req.query.maxPrice)
        : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    };

    const result = await getCars(filters);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};