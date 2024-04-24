import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoURL = process.env.MONGO_URI; //Replace 'mydatabase' with your database name

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Connected to MongoDB Server");
})
db.on('disconnected',()=>{
    console.log("Unable to connect to MongoDB Server");
})
db.on('error',(err)=>{
    console.error('Error : ' , err);
})

export default db;