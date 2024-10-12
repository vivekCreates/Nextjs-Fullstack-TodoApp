import { verifyJWT } from "@/helpers/verifyToken";
import { connectDB } from "@/lib/db";
import { todoModel } from "@/models/todo.model";
import { userModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();
  try {
    const { title, desc } = await request.json();
    const {userId,token} = await verifyJWT(request);
    if (!token) {
      return NextResponse.json({
        success:false,
        message:"user not authorized"
      },{status:401})
    }
    console.log("userId", userId);

    if (!title || !desc) {
      return NextResponse.json(
        {
          success: true,
          message: "All field are required",
        },
        {
          status: 400,
        }
      );
    }

    const todo = await todoModel.create({
      title,
      desc,
    });
    if (!todo) {
      return NextResponse.json(
        {
          success: false,
          message: "todo not created",
        },
        {
          status: 400,
        }
      );
    }

    const currentUser = await userModel.findByIdAndUpdate(userId, {
      $push: {
        todos: todo._id,
      },
      
    },{ new: true });

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "cant get current user",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        todo,
        message: "todo created",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(`Something wrong while creating todo ${error.message}`);
  }
}
