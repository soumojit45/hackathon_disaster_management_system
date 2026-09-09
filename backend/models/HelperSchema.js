import mongoose from "mongoose";

const HelperSchema = new mongoose.Schema({
    // name
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
        lowercase: true,
        trim: true
    },
    
    helperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HelperAcc",
        required: true,
    },
    phoneNumber: {
        type: String, 
        required: true,
        sparse: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    helpAvailable: [{
        type: String,
        enum: [
            'Food', 
            'Medical', 
            'Shelter', 
            'Transportation', 
            'Clothing', 
            'Volunteers', 
            'Baby Supplies', 
            'Sanitary Products', 
            'Other'
        ]
    }],
    description: {
        type: String,
        trim: true
    }
}, { 
    timestamps: true 
});

const Helper = mongoose.model("Helper", HelperSchema);
export default Helper;