import { z } from 'zod';

export const orderIdParamSchema = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid order id format' }),
  })
  .strict();

const orderItemSchema = z
  .object({
    product: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid product id format' }),
    qty: z.number().int().positive(),
    name: z.string().trim().min(1).max(200),
    image: z.string().trim().min(1).max(500),
    price: z.number().nonnegative(),
  })
  .strict();

const shippingAddressSchema = z
  .object({
    address: z.string().trim().min(1).max(200),
    city: z.string().trim().min(1).max(100),
    postalCode: z.string().trim().min(1).max(40),
    country: z.string().trim().min(1).max(100),
  })
  .strict();

export const createOrderSchema = z
  .object({
    orderItems: z
      .array(orderItemSchema)
      .min(1, { message: 'At least one order item is required' }),
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.string().trim().min(1).max(100),
    itemsPrice: z.number().nonnegative(),
    taxPrice: z.number().nonnegative(),
    shippingPrice: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
  })
  .strict();

export const updateOrderToPaidSchema = z
  .object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid order id format' }),
    status: z.string().trim().min(1),
    update_time: z.string().trim().min(1),
    payer: z
      .object({
        email_address: z.string().trim().toLowerCase().email(),
      })
      .strict(),
  })
  .strict();
