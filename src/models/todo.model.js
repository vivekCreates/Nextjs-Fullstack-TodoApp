import mongoose,{Schema}from "mongoose";


const todoSchema = new Schema(
    {
        title:{
            type:String,
            required:true
        },
        desc:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true,
            enum:["pending","complete"],
            default:"pending"
        },
        isCompleted:{
            type:Boolean,
            default:false
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }

    },
    {timestamps:true}
)

export const todoModel = mongoose.models.todo || mongoose.model("todo",todoSchema)