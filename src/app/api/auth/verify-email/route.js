import { ConnectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFuncation";
import { jwtVerify } from "jose";
import { UserModel } from "@/models/User.model";
import { isValidObjectId } from "mongoose";
export async function POST(request) {
    try {
        await ConnectDB();

        const { token } = await request.json();
        if (!token) {
            return response(false, 400, "Token is required for email verification");
        }
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const decoded = await jwtVerify(token, secret)

        const userId = decoded.payload.userId;

        // getuser

        const user = await UserModel.findById(userId);

        
        if(!isValidObjectId(userId)){
            return response(false, 400, "inValid user Id fount",userId);

        }
        if(!user){
            return response(false, 400, "user not fount");
        }

        user.isEmailVerified = true;
        await user.save();

            return response(false, 200, "User Email Verified Successfully");

    } catch (error) {
        return catchError(error)
    }

}