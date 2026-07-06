import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone")
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Enter a valid phone"),
  relationship: z.string().trim().max(50).optional().or(z.literal("")),
  priority: z.coerce.number().int().min(1).max(10),
  is_primary: z.boolean(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type ContactOutput = z.output<typeof contactSchema>;
