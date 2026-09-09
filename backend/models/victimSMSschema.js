import mongoose from "mongoose";

const VictimSMSSchema = new mongoose.Schema({
    contactPersonName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    exactLocation: {
        type: String,
        required: true,
        trim: true
    },
    numberOfPeopleAffected: {
        type: Number,
        required: true,
        min: 1
    },
    typeOfDisaster: {
        type: String,
        required: true,
        trim: true
    },
    helpsRequired: [{
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
    urgencyScore: {
        type: Number,
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted"],
        default: "Pending"
    }
}, {
    timestamps: true
});

VictimSMSSchema.index({urgencyScore:-1})

const VictimSMS = mongoose.model("VictimSMS", VictimSMSSchema);
export default VictimSMS;