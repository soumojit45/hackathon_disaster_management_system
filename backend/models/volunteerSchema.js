import mongoose from "mongoose";
import { boolean } from "zod";

const volunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    contactno: {
        type: String,
        required: true,
        trim: true
    },
    availableArea: {
        type: String,
        required: true,
        trim: true
    },
    IsActive: {
        type: Boolean,
        required: true,
        default: true
    },
    VER_IMG_LINK: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
export default Volunteer;