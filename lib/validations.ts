import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["SEEKER", "RECRUITER"]),
});

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(2, "Company name required"),
  location: z.string().min(2, "Location required"),
  remote: z.boolean().default(false),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE", "INTERNSHIP"]),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  stack: z.array(z.string()).min(1, "At least one skill required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.array(z.string()),
  benefits: z.array(z.string()),
});

export const applicationSchema = z.object({
  jobId: z.string().cuid(),
  coverLetter: z
    .string()
    .min(100, "Cover letter must be at least 100 characters")
    .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
