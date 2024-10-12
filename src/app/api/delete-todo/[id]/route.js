import { verifyJWT } from "@/helpers/verifyToken";
import { todoModel } from "@/models/todo.model";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  const id = request.url.split("delete-todo/")[1];
  const { token } = await verifyJWT(request);
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "user not authorized",
      },
      { status: 401 }
    );
  }
  try {
    const deletedTodo = await todoModel.findByIdAndDelete(id);
    if (!deletedTodo) {
      return NextResponse.json(
        {
          success: false,
          message: "todo not deleted",
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "todo deleted",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(`Something wrong while deleting todo ${error.message}`);
  }
}
