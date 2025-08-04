import { ConnectDB } from "@/lib/databaseConnection";
import { catchError, gernerateOTP, response } from "@/lib/helperFuncation";
import { UserModel } from "@/models/User.model";
import { z } from "zod";
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { OTPModel } from "@/models/Otp.model";
import { otpEmail } from "@/email/otpEmail";
import { getMaxListeners } from "events";
import { SignJWT } from "jose";
export async function POST(request) {

    try {
        await ConnectDB();
        const payload = await request.json();
        const validationSchema = z.object({
            email: z.string().email({ message: "Invalid email address" }),
            password: z.string().min(6, { message: "Password must be at least 6 characters long" })
        });

        const validatedData = validationSchema.safeParse(payload);
        if (!validatedData.success) {
            return response(false, 401, "Invalid input", validatedData.error.errors);
        }

        const { email, password } = validatedData.data;

        // login check

        const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password");

        if (!getUser) {
            return response(false, 404, "User not found");
        }
        // resend email verification list
        if (!getUser.isEmailVerified) {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY);
            const token = await new SignJWT({ userId: NewRegistration._id.toString() })
                .setIssuedAt()
                .setExpirationTime("1h")
                .setProtectedHeader({ alg: "HS256" })
                .sign(secret);

            await sendMail(
                "Email Verification request",
                email,
                emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`)
            );

            return response(false, 403, "Your Email is not Verified");

        }

        // compare password
        const isPasswordVerified = await getUser.comparePassword(password)
        if (!isPasswordVerified) {
            return response(false, 400, "Invalid password");
        }

        // OTP generation
        await OTPModel.deleteMany({ email }); // Clear previous OTPs for the email

        const opt = gernerateOTP();
        //storing OTP in db
        const newOtp = new OTPModel({
            email,
            otp: opt
        });
        await newOtp.save();

        const otpEMailStatus = await sendMail("Your login verificationcode", email, otpEmail(opt));

        if (!otpEMailStatus) {
            return response(false, 500, "Failed to send OTP")
        }

        return response(true, 200, "OTP send successfully")



    } catch (error) {
        return catchError(error)
    }

}