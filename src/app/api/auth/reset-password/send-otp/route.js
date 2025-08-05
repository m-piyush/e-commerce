
import { ConnectDB } from "@/lib/databaseConnection";
import { catchError, gernerateOTP, response } from "@/lib/helperFuncation";
import { UserModel } from "@/models/User.model";
import { z } from "zod";
import { sendMail } from "@/lib/sendMail";
import { OTPModel } from "@/models/Otp.model";
import { otpEmail } from "@/email/otpEmail";

export async function POST(request) {
    try {
        await ConnectDB();
        const payload = await request.json();
        const validationSchema = z.object({
            email: z.string().email({ message: "Invalid email address" }),
        });
       

        const validatedData = validationSchema.safeParse(payload);
        if (!validatedData.success) {
            return response(false, 401, "Invalid input", validatedData.error.errors);
        }

        const { email } = validatedData.data;

        // login check
        const getUser = await UserModel.findOne({ deletedAt: null, email })


        if (!getUser) {
            return response(false, 404, "User not found");
        }

        // remove old OTP
        await OTPModel.deleteMany({ email });

        const otp = gernerateOTP();
        const newOtpData = new OTPModel({
            email,
            otp
        });

        

        await newOtpData.save();

        const otpSendState = await sendMail("Your login verification.", email, otpEmail(otp))

        if (!otpSendState) {
            return response(false, 400, "Failed resend OTP");

        }

        return response(true, 200, "Please verify your device");
    } catch (error) {
        catchError(error)
    }
}