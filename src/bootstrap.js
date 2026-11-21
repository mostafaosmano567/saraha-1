import express from "express"
import cors from "cors"
import connectionDB from "./DB/connectionDB.js"
import { userRouter } from "./modules/users/user.controller.js"
import {connectionRedis,  redis_client } from "./DB/connection.redis.js"
import { getValue, setKeyValue } from "./DB/srevices/redis.service.js"

const app =express()

const port =3000




const bootstrap = async()=>{
    try{
        app.use(cors())
        app.listen(port,()=>{
        console.log("server running on 3000")
    })

        app.use(express.json())
        

    
        app.get("/",(req,res)=>{
            res.status(200).json({message: "hello world"})})
        app.use('/users',userRouter)
        app.use("/*demo",(req,res,next)=>{
            res.status(404).json({message:"this is demo route"})
        })
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(err.cause || 500).json({error:err.message,stack:err.stack});
        });
        await connectionRedis()
        await connectionDB()
    }catch(error){
        console.log(error)
    }
}
export default bootstrap