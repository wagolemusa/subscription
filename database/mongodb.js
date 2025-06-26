import mongoose from "mongoose";

import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI){
    throw new Error("please define the MONGODB_URI enviroment varialbe inside .env.<development/production>.local")
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to database ${NODE_ENV}`)
    } catch(error){
        console.error('Error connectiong to database:', error)
        process.exit(1)
    }
}

export default connectToDatabase;

