import { z } from "zod";

export const usernameValidation = z
.string()
.min(4,"Username must be atleast 2 charecters")
.max(20,"Username must be atmost 20 charecters")
.regex(/^[a-zA-Z0-9_]+$/,"Username must notnot contain special charecter")

export const signUpSchema = z.object({
    username: usernameValidation,
    fullname:z.string({message: 'Invalid email address' }),
  
    email: z.string().email({ message: 'Invalid fullname'}),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
  });