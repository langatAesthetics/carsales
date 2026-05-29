import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createCar,
  getCars,
  getSingleCar,
  updateCar,
  deleteCar,
} from "../services/car.service";

/* ================= CREATE ================= */

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

/* ================= GET ALL ================= */

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

/* ================= GET SINGLE ================= */

export const getSingleCarController =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const car = await getSingleCar(
        req.params.id
      );

      if (!car) {
        return res.status(404).json({
          message: "Car not found",
        });
      }

      res.status(200).json(car);
    } catch (error) {
      next(error);
    }
  };

/* ================= UPDATE ================= */

export const updateCarController = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageUrl = req.file?.path;

    const car = await updateCar(
      req.params.id,
      {
        ...req.body,
        ...(imageUrl && { imageUrl }),
      }
    );

    res.status(200).json(car);
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE ================= */

export const deleteCarController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteCar(req.params.id);

    res.status(200).json({
      message:
        "Car deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};