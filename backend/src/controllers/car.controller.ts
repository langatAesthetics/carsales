import { Request, Response, NextFunction } from "express";

import {
  createCar,
  getCars,
  updateCar,
  deleteCar,
} from "../services/car.service";

export const createCarController = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageUrl = req.file?.path || null;

    const car = await createCar(
      {
        ...req.body,
        imageUrl,
      },
      req.user.id
    );

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
    const cars = await getCars();

    res.status(200).json(cars);
  } catch (error) {
    next(error);
  }
};

export const updateCarController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageUrl = req.file?.path;

    const car = await updateCar(req.params.id, {
      ...req.body,
      ...(imageUrl && { imageUrl }),
    });

    res.status(200).json(car);
  } catch (error) {
    next(error);
  }
};

export const deleteCarController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteCar(req.params.id);

    res.status(200).json({
      message: "Car deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};