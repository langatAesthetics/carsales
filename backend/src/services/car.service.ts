import prisma from "../config/prisma";

export const createCar = async (data: any, userId: string) => {
  const safeData = {
    title: data.title,
    brand: data.brand,
    price: Number(data.price),
    year: Number(data.year),
    imageUrl: data.imageUrl || null,
  };

  return await prisma.car.create({
    data: {
      ...safeData,
      userId,
    },
  });
};

export const getCars = async (filters: any) => {
  const { brand, year, minPrice, maxPrice, page, limit } = filters;

  const where: any = {};

  if (brand) where.brand = brand;
  if (year) where.year = year;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }

  const skip = (page - 1) * limit;

  const [cars, total] = await Promise.all([
    prisma.car.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.car.count({ where }),
  ]);

  return {
    data: cars,
    meta: {
      total,
      page,
      limit,
    },
  };
};