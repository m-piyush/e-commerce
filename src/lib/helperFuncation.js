import { NextResponse } from "next/server";

export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json({
    success,
    statusCode,
    message,
    data,
  }, { status: statusCode });
};

export const catchError = (error, customMessage) => {
  if (error?.code === 1000 && error?.keyPattern) {
    const keys = Object.keys(error.keyPattern).join(", ");
    error.message = `Duplicate fields: ${keys} already exists`;
  }

  let errorObj = {};
  if (process.env.NODE_ENV === "development") {
    errorObj = {
      message: error.message,
      error,
    };
  } else {
    errorObj = {
      message: customMessage || "An error occurred",
      error,
    };
  }

  return NextResponse.json({
    success: false,
    statusCode: error.code,
    ...errorObj
  });

  // response(false, 500, errorObj.message, errorObj.error);
};

export const gernerateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}
