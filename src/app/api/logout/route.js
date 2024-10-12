import { verifyJWT } from "@/helpers/verifyToken";
import { connectDB } from "@/lib/db";
import { userModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();
  const { userId, token } = await verifyJWT(request);
  if (!token) {
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "user not authorized",
        },
        { status: 401 }
      );
    }
  }

  try {
    const user = await userModel.findById(userId);

    const response = NextResponse.json(
      {
        success: true,
        user,
        message: "user logout successfully",
      },
      {
        status: 200,
      }
    );
    response.cookies.delete("token");
    return response;
  } catch (error) {
    console.error(`Something wrong while logout ${error.message}`);
  }
}
