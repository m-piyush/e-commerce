import cloudinary from "@/lib/cloudinary";
import { ConnectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFuncation";
import { MediaModel } from "@/models/media.model";

export async function POST(request) {
    const payload = await request.json()
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, 'Unauthorized');
        }
        await ConnectDB();
        const newMedia = await MediaModel.insertMany(payload)
        return response(true, 200, "Media upload successfully", newMedia)

    } catch (error) {

        if (payload && payload.length > 0) {
            const publicIds = payload.map((data => data.public_id))
            try {
                await cloudinary.api.delete_resources(publicIds)
            } catch (deleteError) {
                error.cloudinary = deleteError
            }
        }
        return catchError(error)
    }

}