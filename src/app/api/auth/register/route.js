import { emailVerificationLink } from "@/email/emailVerificationLink";
import { ConnectDB } from "@/lib/databaseConnection";
import zSchema from "@/lib/zodSchema";
import { catchError, response } from "@/lib/helperFuncation";
import { sendMail } from "@/lib/sendMail";
import { UserModel } from "@/models/User.model";
import { SignJWT } from "jose";


export async function POST(request) {
  try {
    await ConnectDB();

    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json();
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(false, 401, "Invalid or missing input field", validatedData.error);
    }

    const { name, email, password } = validatedData.data;

    const checkUser = await UserModel.exists({ email });
    if (checkUser) {
      return response(false, 409, "User already exists with this email");
    }

    const NewRegistration = new UserModel({ name, email, password });
    await NewRegistration.save();

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

    return response(true, 200, "Registration successful, please verify your email");
  } catch (error) {
    // ✅ You must RETURN this!
    return catchError(error);
  }
}
