import mongoose,{Schema}from "mongoose";

const userSchema = new Schema(
    {
        username:{
            type:String,
            lowercase:true,
            required:true,
            trim:true
        },
        email:{
            type:String,
            lowercase:true,
            required:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
        },
        todos:[
            { type: mongoose.Schema.Types.ObjectId, ref: "todo" }
        ]
    },
    {timestamps:true}
)


export const userModel = mongoose.models.user || mongoose.model("user",userSchema)