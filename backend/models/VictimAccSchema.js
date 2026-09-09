import mongoose from "mongoose";

const VictimAccSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true
    },
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
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});


const VictimAcc = mongoose.model("VictimAcc", VictimAccSchema);
export default VictimAcc;