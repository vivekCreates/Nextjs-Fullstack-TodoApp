import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";

export async function verifyJWT(request) {
    const token = request.cookies.get('token')?.value || ""
    if (!token) {
        return NextResponse.json(
            {
                success:false,
                message:"user not authenticated"
            },
            {
                status:400
            }
        )
    }

    const decoded =  jwt.verify(token,process.env.JWT_SECRET);
    return {userId:decoded._id,token}
}