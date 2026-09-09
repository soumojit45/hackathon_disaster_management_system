import { z } from "zod";

// Regex for exactly 10 digits
const phoneRegex = /^\d{10}$/;


// Valid Help Options from your Schema
const helpsEnum = z.enum([
    'Food', 'Medical', 'Shelter', 'Transportation', 
    'Clothing', 'Volunteers', 'Baby Supplies', 
    'Sanitary Products', 'Other'
]);

export const signupSchema = z.object({
    contactPersonName: z.string().trim().min(1, "Name is required"),
    phoneNumber: z.string()
        .trim()
        .regex(phoneRegex, "Phone number must be exactly 10 digits"),
    password: z.string()
        .min(6, "Password must be at least 6 characters long"),
    // email is optional, but if provided, it must be a valid email (or an empty string)
    email: z.string().email("Please provide a valid email address").or(z.literal(''))
});

export const loginSchema = z.object({
    phoneNumber: z.string()
        .trim()
        .regex(phoneRegex, "Phone number must be exactly 10 digits"),
    password: z.string().min(1, "Password is required")
});

export const needHelpSchema = z.object({
    numberOfPeopleAffected: z.number().int().min(1, "Must be at least 1 affected person"),
    typeOfDisaster: z.string().trim().min(1, "Type of disaster is required"),
    helpsRequired: z.array(helpsEnum).min(1, "Please select at least one type of help required"),
    description: z.string().trim().optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
});