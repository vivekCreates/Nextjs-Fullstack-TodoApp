import { userModel } from "@/models/user.model";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { connectDB } from "@/lib/db";

export async function POST(request) {
    await connectDB();
   try {
     const {username,email,password} = await request.json();
 
     if ([username,email,password].find(field=>field?.trim() == "")) {
         return NextResponse.json(
             {
                 success:false,
                 message:"All field are required"
             },
             {
                 status:400
             }
         )
     }
 
 
     const userExists = await userModel.findOne({email});
 
     if (userExists) {
         return NextResponse.json(
             {
                 success:false,
                 message:"user already exist"
             },
             {
                 status:400
             }
         )
     }
 
    const hashedPassword = await bcrypt.hash(password,10);
    if (!hashedPassword) {
     console.log("something wrong while hashing password")
     return 
    }
 
  const user = await userModel.create({
     username,
     email,
     password:hashedPassword
    })
 
    if (!user) {
     return NextResponse.json(
         {
             success:false,
             message:"user not registered"
         },
         {
             status:400
         }
     )
    }
 
    return NextResponse.json(
     {
         success:true,
         user,
         message:"user registered successfully"
     },
     {
         status:201
     }
    )
   } catch (error) {
    console.error(`Something wrong while registring user ${error.message}`)
   }
}