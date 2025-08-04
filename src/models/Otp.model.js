import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        rquired: true,
        default: () => Date.now() + 10 * 60 * 1000 // 10 minutes
    },

}, {
    timestamps: true
})


otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const OTPModel = mongoose.models.OTP || mongoose.model("OTP", otpSchema, 'otps');

export { OTPModel };
