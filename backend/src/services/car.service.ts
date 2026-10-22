import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";

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

/* ================= PAGINATED VEHICLES ================= */

export interface GetPaginatedCarsOptions {
  page: number;
  limit: number;
  search?: string;
  brand?: string;
  model?: string;
  price?: string;
}

export const getPaginatedCars = async ({
  page,
  limit,
  search = "",
  brand = "",
  model = "",
  price = "",
}: GetPaginatedCarsOptions) => {
  const searchTerm = search.trim();

  const searchConditions: Prisma.CarWhereInput[] = [];


  if (searchTerm) {
    searchConditions.push(
      {
        title: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        brand: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        model: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: searchTerm,
          mode: "insensitive",
        },
      }
    );

    const normalizedSearch = searchTerm.toUpperCase();

    const validFuelTypes = [
      "PETROL",
      "DIESEL",
      "HYBRID",
      "ELECTRIC",
    ] as const;

    const validTransmissions = [
      "AUTOMATIC",
      "MANUAL",
    ] as const;

    if (
      (validFuelTypes as readonly string[]).includes(
        normalizedSearch
      )
    ) {
      searchConditions.push({
        fuelType: normalizedSearch as
          | "PETROL"
          | "DIESEL"
          | "HYBRID"
          | "ELECTRIC",
      });
    }

    if (
      (validTransmissions as readonly string[]).includes(
        normalizedSearch
      )
    ) {
      searchConditions.push({
        transmission: normalizedSearch as
          | "AUTOMATIC"
          | "MANUAL",
      });
    }

    // Search by year when the search term is numeric.
    const year = Number(searchTerm);

    if (Number.isInteger(year) && year > 0) {
      searchConditions.push({ year });
    }
  }


  const where: Prisma.CarWhereInput = {
    ...(brand && { brand }),
    ...(model && { model }),
    ...(searchTerm && { OR: searchConditions }),
  };

  switch (price) {
    case "under-1m":
      where.price = { lt: 1_000_000 };
      break;

    case "1m-3m":
      where.price = {
        gte: 1_000_000,
        lt: 3_000_000,
      };
      break;

    case "3m-5m":
      where.price = {
        gte: 3_000_000,
        lt: 5_000_000,
      };
      break;

    case "5m-10m":
      where.price = {
        gte: 5_000_000,
        lte: 10_000_000,
      };
      break;

    case "above-10m":
      where.price = { gt: 10_000_000 };
      break;
  }

  const [totalItems, brandRecords, modelRecords] =
    await Promise.all([
      prisma.car.count({ where }),

      // Keep brand options available across the catalogue.
      prisma.car.findMany({
        distinct: ["brand"],
        select: { brand: true },
        orderBy: { brand: "asc" },
      }),

      // Models depend on the selected brand.
      prisma.car.findMany({
        where: brand ? { brand } : {},
        distinct: ["model"],
        select: { model: true },
        orderBy: { model: "asc" },
      }),
    ]);

  const totalPages = Math.ceil(totalItems / limit);

  // Keep the requested page within the valid range.
  const currentPage = Math.min(
    page,
    Math.max(totalPages, 1)
  );

  const data = await prisma.car.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * limit,
    take: limit,
  });

  return {
    data,
    pagination: {
      page: currentPage,
      limit,
      totalItems,
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    },
    filters: {
      brands: brandRecords.map((item) => item.brand),
      models: modelRecords
        .map((item) => item.model)
        .filter((item): item is string => Boolean(item)),
    },
  };
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