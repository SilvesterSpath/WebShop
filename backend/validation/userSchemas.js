import { z } from 'zod';

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: 'Invalid email address' });

const nameField = z
  .string()
  .trim()
  .min(1, { message: 'Name is required' })
  .max(100, { message: 'Name must be at most 100 characters' });

export const registerUserSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(128, { message: 'Password must be at most 128 characters' }),
  })
  .strict();

export const loginUserSchema = z
  .object({
    email: emailField,
    password: z.string().min(1, { message: 'Password is required' }),
  })
  .strict();

export const updateProfileSchema = z
  .object({
    name: nameField.optional(),
    email: emailField.optional(),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(128, { message: 'Password must be at most 128 characters' })
      .optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.name !== undefined ||
      data.email !== undefined ||
      data.password !== undefined,
    { message: 'At least one of name, email, or password is required' }
  );
