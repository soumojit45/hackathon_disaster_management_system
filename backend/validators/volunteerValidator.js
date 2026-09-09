import { z } from "zod";

// 1. Volunteer SIGNUP Validator
const volunteerSignupSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(1, "Name cannot be empty"),
        
    location: z
        .string({ required_error: "Location is required" })
        .trim()
        .min(1, "Location cannot be empty"),
        
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email format")
        .lowercase(),
        
    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long"),
        
    contactno: z
        .string({ required_error: "Contact number is required" })
        .trim()
        .min(1, "Contact number cannot be empty"),
        
    availableArea: z
        .string({ required_error: "Available area is required" })
        .trim()
        .min(1, "Available area cannot be empty"),
        
    IsActive: z
        .boolean()
        .optional(),

    VER_IMG_LINK: z
            .string({ required_error: "Verification image link is required" })
});

// 2. Volunteer LOGIN Validator
const volunteerLoginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email format")
        .lowercase(),
        
    password: z
        .string({ required_error: "Password is required" })
});

// Safe parse wrapper functions
export const volunteer_signup_validator = (data) => {
    return volunteerSignupSchema.safeParse(data);
};

export const volunteer_login_validator = (data) => {
    return volunteerLoginSchema.safeParse(data);
};
