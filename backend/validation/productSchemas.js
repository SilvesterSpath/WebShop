import { z } from 'zod';

export const productListQuerySchema = z
  .object({
    keyword: z.string().trim().max(64).optional(),
    pageNumber: z.coerce.number().int().min(1).optional(),
  })
  .strict();

export const productIdParamSchema = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid product id format' }),
  })
  .strict();

export const productReviewSchema = z
  .object({
    rating: z.coerce.number().min(1).max(5),
    comment: z.string().trim().min(1).max(1000),
  })
  .strict();

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    price: z.number().nonnegative(),
    description: z.string().trim().min(1).max(2000),
    image: z.string().trim().min(1).max(500),
    brand: z.string().trim().min(1).max(200),
    category: z.string().trim().min(1).max(200),
    countInStock: z.number().int().nonnegative(),
  })
  .strict();
