import mongoose from "mongoose";

const HelperAccSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    registrationType: {
        type: String,
        required: true,
        trim: true,
        enum: ['NGO', 'Individual']
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
        required: true,
    },
    latitude: {
        type: Number,
        min: -90,
        max: 90
    },
    longitude: {
        type: Number,
        min: -180,
        max: 180
    },
    VER_IMG_LINK: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String, 
        // required: true,
        sparse: true
    }
}, {
    timestamps: true
});

const HelperAcc = mongoose.model("HelperAcc", HelperAccSchema);
export default HelperAcc;