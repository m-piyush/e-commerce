import { otpEmail } from "@/email/otpEmail";
import { ConnectDB } from "@/lib/databaseConnection";
import { catchError, gernerateOTP,response } from "@/lib/helperFuncation";
import { sendMail } from "@/lib/sendMail";
import zSchema from "@/lib/zodSchema";
import { UserModel } from "@/models/User.model";
import { OTPModel } from "@/models/Otp.model";

export async function POST(request) {
    try {
        ConnectDB();

        const payload = await request.json();
        const validationSchema = zSchema.pick({
            email: true
        })
        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
            return response(false, 401, "Invalid or missing field", validatedData.error);
        }

        const { email } = validatedData.data

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

        return response(true, 200, "OTP send successfully");

    } catch (error) {
        return catchError(error)
    }
}