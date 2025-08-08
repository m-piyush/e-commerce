import { ConnectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFuncation";
import { cookies } from "next/headers";

export async function POST(request) {
    try {

        await ConnectDB();
        const cookieStore = await cookies();
        console.log("cookieStore", cookieStore.has('token'));
        cookieStore.delete('token')

        return response(true, 200, "Logout sucessfully")
    } catch (error) {

        return catchError(error)

    }
}