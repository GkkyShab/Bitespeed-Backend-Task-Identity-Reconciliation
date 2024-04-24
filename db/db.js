import mongoose from "mongoose";

const mongoURL = 'mongodb://127.0.0.1:27017/bitespeed'; //Replace 'mydatabase' with your database name

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