import { z } from "zod";

// 1. HelperAcc SIGNUP Validator (Matches HelperAccSchema)
const helperAccSignupSchema = z.object({
    fullName: z
        .string({ required_error: "Full name is required" })
        .trim()
        .min(2, "Name must be at least 2 characters long"),
        
    registrationType: z
        .enum(['NGO', 'Individual'], {
            errorMap: () => ({ message: "Registration type must be NGO, Individual" })
        }),
        
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email format")
        .lowercase(),
        
    password: z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters long" })
        // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        // .regex(/[0-9]/, { message: "Password must contain at least one number" })
        // .regex(/[\W_]/, { message: "Password must contain at least one special character" })
        ,

    // Added latitude and longitude here to match your Mongoose schema
    latitude: z
        .number({ required_error: "Latitude is required", invalid_type_error: "Latitude must be a number" })
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
        .optional(), // Added optional() since your Mongoose schema doesn't have required: true
        
    longitude: z
        .number({ required_error: "Longitude is required", invalid_type_error: "Longitude must be a number" })
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180")
        .optional(), // Added optional() since your Mongoose schema doesn't have required: true

    VER_IMG_LINK: z
        .string({ required_error: "Verification image link is required" })
});

// 2. LOGIN Validator (Shared for authentication)
const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email format")
        .lowercase(),
        
    password: z
        .string({ required_error: "Password is required" })
});

// 3. Helper Schema Profile Validator (Matches HelperSchema)
const helperProfileSchema = z.object({
    phoneNumber: z
        .string({ required_error: "Phone number is required" })
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"), // Validates international E.164 format
        
    destination: z
        .string({ required_error: "Destination is required" })
        .trim()
        .min(1, "Destination cannot be empty"),
        
    helpAvailable: z
        .array(
            z.enum([
                'Food', 'Medical', 'Shelter', 'Transportation', 
                'Clothing', 'Volunteers', 'Baby Supplies', 
                'Sanitary Products', 'Other'
            ])
        )
        .min(1, "Select at least one type of help available"),
        
    description: z
        .string()
        .trim()
        .optional()
});

// Safe parse wrapper functions used in your controller
export const helper_signup_validator = (data) => {
    return helperAccSignupSchema.safeParse(data);
};

export const helper_login_validator = (data) => {
    return loginSchema.safeParse(data);
};

export const helper_register_validator = (data) => {
    return helperProfileSchema.safeParse(data);
};