import { connectDB } from "@/lib/db";
import { userModel } from "@/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
export async function POST(request) {
    await connectDB();
 try {
     const { email, password } = await request.json();
   
     if (!email || !password) {
       return NextResponse.json(
         {
           success: false,
           message: "All field are required",
         },
         {
           status: 400,
         }
       );
     }
   
     const user = await userModel.findOne({ email });
   
     if (!user) {
       return NextResponse.json(
         {
           success: false,
           message: "you dont have account",
         },
         {
           status: 400,
         }
       );
     }
   
     const isPasswordCorrect = await bcrypt.compare(password, user.password);
   
     if (!isPasswordCorrect) {
       return NextResponse.json(
         {
           success: false,
           message: "email or password is invalid",
         },
         {
           status: 400,
         }
       );
     }
   
     const token = jwt.sign({_id:user._id,email:user.email}, process.env.JWT_SECRET, {
       expiresIn: "10d",
     });
     console.log('token',token)
     if (!token) {
       return NextResponse.json(
         {
           success: false,
           message: "don't have token",
         },
         {
           status: 401,
         }
       );
     }
   
     const response = NextResponse.json(
       {
         success: true,
         user,
         message: "User logged in successfully",
       },
       {
         status: 200,
       }
     );
   
     // Set the cookie on the response object
     response.cookies.set('token', token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'strict',
       maxAge: 60 * 60 * 24 * 10, // 10 days
       path: '/',
     });
   
     // Return the response with the cookie set
     return response;
 } catch (error) {
    console.error(`Something wrong while login ${error.message}`)
 }
}
