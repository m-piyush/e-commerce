import { ConnectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFuncation";
import { OTPModel } from "@/models/Otp.model"
import { UserModel } from "@/models/User.model";
import zSchema from "@/lib/zodSchema";

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

        // del OTP afer verification
        await getOtpData.deleteOne();

        return response(true, 200, "OTP Verfiy");
    } catch (error) {

        return catchError(error)
    }
}