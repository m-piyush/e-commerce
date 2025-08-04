import { z } from 'zod';

const zSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .max(50, { message: 'Password must be less than 50 characters' })
        .refine((val) => /[A-Z]/.test(val), {
            message: 'Password must contain at least one uppercase letter',
        })
        .refine((val) => /[0-9]/.test(val), {
            message: 'Password must contain at least one number',
        })
        .refine((val) => /[^A-Za-z0-9]/.test(val), {
            message: 'Password must contain at least one special character',
        }),
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters' })
        .max(50, { message: 'Name must be at most 50 characters' })
        .regex(/^[A-Za-z\s]+$/, { message: 'Name can only contain letters and spaces' }),
    otp:z.string()
});

export default zSchema
