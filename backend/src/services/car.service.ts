import prisma from "../config/prisma";

import {
  FuelType,
  Transmission,
  DriveType,
  Condition,
  Status,
} from "@prisma/client";

/* ================= CREATE ================= */

export const createCar = async (
  data: any,
  userId: string
) => {
  return await prisma.car.create({
    data: {
      title: data.title,
      brand: data.brand,
      model: data.model || null,
      year: data.year ? Number(data.year) : null,

      price: Number(data.price),

      mileage: data.mileage
        ? Number(data.mileage)
        : null,

      engineSize: data.engineSize
        ? Number(data.engineSize)
        : null,

      fuelType: data.fuelType as FuelType,
      transmission:
        data.transmission as Transmission,
      driveType: data.driveType as DriveType,

      condition: data.condition as Condition,
      status: data.status as Status,

      description: data.description || null,

      imageUrl: data.imageUrl || null,

      userId,
    },
  });
};

/* ================= GET ALL ================= */

export const getCars = async () => {
  return await prisma.car.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

/* ================= GET SINGLE ================= */

export const getSingleCar = async (
  id: string
) => {
  return await prisma.car.findUnique({
    where: { id },
  });
};

/* ================= UPDATE ================= */

export const updateCar = async (
  id: string,
  data: any
) => {
  return await prisma.car.update({
    where: { id },

    data: {
      title: data.title,
      brand: data.brand,
      model: data.model || null,

      year: data.year
        ? Number(data.year)
        : null,

      price: Number(data.price),

      mileage: data.mileage
        ? Number(data.mileage)
        : null,

      engineSize: data.engineSize
        ? Number(data.engineSize)
        : null,

      fuelType: data.fuelType as FuelType,
      transmission:
        data.transmission as Transmission,
      driveType: data.driveType as DriveType,

      condition: data.condition as Condition,
      status: data.status as Status,

      description: data.description || null,

      imageUrl: data.imageUrl || null,
    },
  });
};

/* ================= DELETE ================= */

export const deleteCar = async (
  id: string
) => {
  return await prisma.car.delete({
    where: { id },
  });
};