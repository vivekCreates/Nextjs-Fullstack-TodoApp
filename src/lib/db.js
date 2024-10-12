import mongoose from "mongoose";

export async function connectDB() {
    try {
     const connectedInstance = await mongoose.connect("mongodb://127.0.0.1:27017/nextjs-todo")
     console.log(`mongodb connected successfully ! db host at ${connectedInstance.connection.host}`)
    } catch (error) {
        console.log(`mongodb not connected`)
        process.exit(1)
    }
}