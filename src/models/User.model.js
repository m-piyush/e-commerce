import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ["admin", "user"],
        default: "user"
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
        select: false, // Password will not be returned in queries by default
    },
    avtar: {
        url: {
            type: String,
            trim: true,
        },
        public_id: {
            type: String,
            trim: true,
        }
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true, // For faster queries on deleted users
    }
}, { timestamps: true })


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods = {
    comparePassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    }
}


const UserModel =  mongoose.models.User || mongoose.model("User", userSchema,"users");

export { UserModel };

