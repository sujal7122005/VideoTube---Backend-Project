import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const DB_connect = async () => {
    try {
       const connection_instance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        
       console.log(`DB connected successfully \nHost:, ${connection_instance.connection.host}`);

    } catch (error) {
        console.log("DB connection error:", error);
        throw error;
        process.exit(1);
    }
}

export { DB_connect };