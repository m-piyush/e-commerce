import { ConnectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFuncation";

export async function POST(request){
try {
    console.log("logout");
    
    await ConnectDB();
    const cookieStore=await cookies();
    cookieStore.delete('token')

    return response(true,200,"Logout sucessfully")
} catch (error) {

    return catchError(error)
    
}
}