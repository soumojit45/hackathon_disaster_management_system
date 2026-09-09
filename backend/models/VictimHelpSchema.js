import mongoose from "mongoose";

const VictimHelpSchema = new mongoose.Schema({
    victimId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VictimAcc",
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

VictimHelpSchema.index({ urgencyScore: -1 })

const VictimHelp = mongoose.model("VictimHelp", VictimHelpSchema);
export default VictimHelp;