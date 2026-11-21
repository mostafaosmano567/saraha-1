import mongoose from "mongoose";

export default async function connectionDB(){
    try{
        await mongoose.connect('mongodb://localhost:27017/saraha',{serverSelectionTimeoutMS:5000})
        console.log("DB is connected")
    }catch(error){
        console.log("db failed")
    }
}