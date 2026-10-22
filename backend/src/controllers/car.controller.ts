import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createCar,
  getCars,
  getPaginatedCars,
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

/* ================= GET ALL / PAGINATED ================= */

export const getCarsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isPaginated =
      req.query.page !== undefined ||
      req.query.limit !== undefined;

    // Preserve the existing array response for older callers.
    if (!isPaginated) {
      const cars = await getCars();
      res.status(200).json(cars);
      return;
    }

    const parsePositiveInteger = (
      value: unknown,
      fallback: number
    ): number => {
      if (
        typeof value !== "string" ||
        !/^\d+$/.test(value)
      ) {
        return fallback;
      }

      const parsed = Number(value);

      return Number.isSafeInteger(parsed) && parsed > 0
        ? parsed
        : fallback;
    };

    const page = parsePositiveInteger(req.query.page, 1);

    // Limit the maximum page size to avoid excessive queries.
    const requestedLimit = parsePositiveInteger(
      req.query.limit,
      12
    );

    const limit = Math.min(requestedLimit, 48);

    const getQueryString = (value: unknown): string =>
      typeof value === "string" ? value.trim() : "";

    const result = await getPaginatedCars({
      page,
      limit,
      search: getQueryString(req.query.search),
      brand: getQueryString(req.query.brand),
      model: getQueryString(req.query.model),
      price: getQueryString(req.query.price),
    });

    res.status(200).json(result);
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
        String(req.params.id)
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
    await deleteCar(
      String(req.params.id)
    );

    res.status(200).json({
      message:
        "Car deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};