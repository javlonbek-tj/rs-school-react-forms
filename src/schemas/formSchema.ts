import { z } from 'zod';
import { validateEmail } from '../utils/emailUtils';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

export function createFormSchema(countries: string[]) {
  return z
    .object({
      name: z
        .string()
        .min(1, 'Name is required')
        .refine((val) => val.length === 0 || val[0] === val[0].toUpperCase(), 'First letter must be uppercase'),
      age: z
        .coerce.number()
        .nonnegative('Age cannot be negative')
        .max(150, 'Age must be realistic'),
      email: z
        .string()
        .min(1, 'Email is required')
        .refine(validateEmail, 'Invalid email address'),
      gender: z
        .string()
        .refine((val) => ['male', 'female'].includes(val), 'Please select a gender'),
      password: z.string().min(1, 'Password is required'),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
      country: z
        .string()
        .min(1, 'Country is required')
        .refine((val) => countries.includes(val), 'Country must be from the list'),
      image: z
        .custom<File>()
        .refine((val) => val instanceof File && val.size > 0, 'Image is required')
        .refine(
          (val) => !(val instanceof File) || ALLOWED_TYPES.includes(val.type),
          'Only PNG and JPEG allowed'
        )
        .refine(
          (val) => !(val instanceof File) || val.size <= MAX_FILE_SIZE,
          'Image must be under 5MB'
        ),
      termsAccepted: z
        .boolean()
        .refine((val) => val === true, 'You must accept the terms'),
    })
    .superRefine((data, ctx) => {
      if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Passwords must match',
          path: ['confirmPassword'],
        });
      }
    });
}

export type FormValues = z.infer<ReturnType<typeof createFormSchema>>;
