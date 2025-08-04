import { ConnectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFuncation";
import { cookies } from "next/headers";
import { z } from "zod";
import { OTPModel } from "@/models/Otp.model"
import { UserModel } from "@/models/User.model";
import zSchema from "@/lib/zodSchema";
import { SignJWT } from "jose";
export async function POST(request) {

    try {

        await ConnectDB();
        const payload = await request.json();
        const validationSchema = zSchema.pick({
            email: true, otp: true
        })

        const validatedData = validationSchema.safeParse(payload);
        if (!validatedData.success) {
            return response(false, 401, "Invalid or missiong feild", validatedData.error);
        }

        const { email, otp } = validatedData.data;

        const getOtpData = await OTPModel.findOne({ email, otp });

        if (!getOtpData) {
            return response(false, 404, "Invalid or Expired OTP", validatedData.error);
        }

        const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();


        if (!getUser) {
            return response(false, 404, "User not found");
        }

        const loginUserData = {
            _id: getUser._id,
            email: getUser.email,
            name: getUser.name,
            avatar: getUser.avatar
        }
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT({ loginUserData })
            .setIssuedAt()
            .setExpirationTime("24h")
            .setProtectedHeader({ alg: "HS256" })
            .sign(secret);

        const cookiesStore = await cookies()

        cookiesStore.set({
            name: "token",
            value: token,
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });
        // del OTP afer verification
        await getOtpData.deleteOne();

        return response(true, 200, "Login successful", loginUserData);
    } catch (error) {

        return catchError(error)
    }
}