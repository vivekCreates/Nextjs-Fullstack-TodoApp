import { NextResponse } from "next/server";
import { userModel } from "@/models/user.model";
import { connectDB } from "@/lib/db";
import { verifyJWT } from "@/helpers/verifyToken";
import mongoose from "mongoose";
export async function GET(request) {
    await connectDB();
    const {userId,token }= await verifyJWT(request);
    if (!token) {
      return NextResponse.json({
        success:false,
        message:"user not authorized"
      },{status:401})
    }
    const id = new mongoose.Types.ObjectId(userId)
    if (!userId) {
      return NextResponse.json(
        {
          success:false,
          message:"user not authorized"
        },{
          status:401
        }
      )
    }
 try {
     const user = await userModel.aggregate([
      {
        $match:{_id:id},
      },
      {
        $lookup: {
          from: "todos",
          localField: "todos._id",
          foreignField: "owner",
          as: "todos"
        }
      },{
        $project:{
          _id:1,
          email:1,
          todos:1,
          createdAt:1,
          updatedAt:1
        }
      }
     ])
     
     if (!user) {
       return NextResponse.json({
           success:false,
           message: "cannot get current user",
         },
         {
           status:402
         }
       );
     }
   
     return NextResponse.json({
       success:true,
       user,
       message: "user fetched successfully",
     },
     {
       status:200
     }
   );
 } catch (error) {
    console.error(`Something wrong while getting user ${error.message}`)
 }
}
