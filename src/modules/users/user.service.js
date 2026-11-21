import mongoose from "mongoose";
import userModel from "../../DB/models/user.model.js";
import * as dbService from "../../DB/srevices/DB.service.js";
import * as redis_Service from "../../DB/srevices/redis.service.js";
import { Decrypt, Encrypt } from "../../common/security/encrypt.js";
import {hashSync,compareSync} from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto"
import  {OAuth2Client} from 'google-auth-library';
const client = new OAuth2Client();

import * as bcrypt from "../../common/security/hash.js";
import { providerEnum } from "../../common/enum/user.enum.js";
import { randomUUID } from "node:crypto";
import revokeTokenModel from "../../DB/models/refokeToken.model .js";
import { redis_client } from "../../DB/connection.redis.js";
import { generate_otp, sendEmail } from "../../common/service/send.email.js"; 
import { eventEmitter } from "../../common/utils/events.js";

// ========================= SignUp with email =========================
export const signupWithGmail= async (req,res,next)=>{
    try{
        const {idToken}=req.body
        const ticket = await client.verifyIdToken({
            idToken,
            audience: "224371052632-llp3pgnh5q8v6k0k4burbf6i9s8fiqk4.apps.googleusercontent.com"
        });
    const {picture,given_name,family_name,email_verified,email} = ticket.getPayload();
    let user=await dbService.findOne({model:userModel,filter:{email:email.toLowerCase()}})
    if(!user){
        user =await dbService.create({model:userModel,
            data:{fname:given_name
            ,lname:family_name
            ,email:email
            ,profileImage:picture,
            isConfiremed:email_verified,
        provider:providerEnum.google}
    })}
    const accessToken =jwt.sign({id:user._id,email:user.email},"secret",{
                    expiresIn:60*5
                })
    const refreshToken =jwt.sign({id:user._id,email:user.email},"secret",{
                    expiresIn:60*5
                })

    }catch(error){
        next(error)
    }
}

// ========================= SignUp =========================
export const signup=async (req,res,next)=>{
    try{
        const {fname,lname,email,password,gender,age,phone,profileImage}=req.body
        const emailIsExist = await dbService.findOne({model:userModel,
            filter:{email:email.toLowerCase()}
        })
        if(emailIsExist){
            throw new Error('this email is already exist',{cause:400}) 
        }
        const otp =await generate_otp()
        const save_otp = await redis_Service.setKeyValue({
            key:`otp::${email}`,
            value:hashSync(otp,12),/* await generate_otp() */
            ttl:60*5
        })
        
        eventEmitter.emit('confirm_email',async()=>{
            await sendEmail({
            to:email,
            subject:"confirm your email",
            html:`<h1>${otp}</h1>`     
        })
        })
        console.log(otp)     

        const hashpassword=hashSync(password,12)
        const Encryptphone=Encrypt(phone,'secrit')
        const user=await dbService.create({model:userModel,
            data:{
                fname,
                lname,
                email:email.toLowerCase(),
                password:hashpassword,
                gender,
                age,
                phone:Encryptphone,
                profileImage:req.files.attachment[0].path
            }})

         /*//if(error){
            throw new Error(error,{cause:400})
        } */
           
        return res.status(200).json({message:"added",user})
        //return res.status(200).json({message:"done"})
        /* const {fname,lname,email,password,age,phone,gendare,profileImage,role}=req.body


        
        //return res.status(201).json({message:"hello ",user,accessToken,refreshToken})
        if (emailIsExist){
            return res.status(409).json({message:"this email already exist"})
        }else{



            const user= await dbService.create({model:userModel,data:{fname,lname,email,password:await bcrypt.hash(password,12),role,age,phone:Encrypt(phone),gendare,profileImage}})
            return res.status(201).json({message:"added email",user})
        } */
    }catch(error){
        next(error)
    }
}

// ========================= SignIn =========================
export const signin=async (req,res,next)=>{
    try{
        const {email,password}=req.body
        
        const emailIsExist = await dbService.findOne({model:userModel,filter:{email:email.toLowerCase(),provider:providerEnum.system}})
        if (!emailIsExist){
            return res.status(409).json({message:"this email isn't exist"})
        }else{
            const user= await dbService.findOne({model:userModel,
                filter:{email:email.toLowerCase()}})
            if (await bcrypt.compare(password,user.password)){
                if (user.phone){
                    user.phone = Decrypt(user.phone);
                }
                const tokenId=randomUUID()
                const accessToken =jwt.sign({id:user._id,email:user.email},"secret",{
                    expiresIn:60*60,
                    audience:"http://localhost:4000",
                    issuer:"http://localhost:3000",
                    //notBefore:30,
                    jwtid:tokenId,
                    noTimestamp:false
                })
                const refreshToken =jwt.sign({id:user._id,email:user.email},"refresh_secret",{
                    expiresIn:60*60,
                    audience:"http://localhost:4000",
                    issuer:"http://localhost:3000",
                    //notBefore:30,
                    jwtid:tokenId,
                    noTimestamp:false
                })

                return res.status(201).json({message:"hello ",user,accessToken,refreshToken})
            }else{
                return res.status(409).json({message:"password dosn't match"}) 
            }
            
        }
    }catch(error){
        next(error)
    }
}

export const refreshToken=async (req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
        throw new Error("must be exist refresh token from refreshToken",{cause:400})
    }
    const decodedtoken = jwt.verify(authorization,"refresh_secret")
    if (!decodedtoken){
        throw new Error("invalid refreshToken",{cause:400})
    }
    const user= await dbService.findOne({model:userModel,filter:{_id:decodedtoken.id}})
    
    const accesstoken= jwt.sign({id:user.id,email:user.email},"secret",{
        expiresIn:60*5,
        audience:"http://localhost:4000",
        issuer:"http://localhost:3000"
    })
    console.log(user)
    res.status(201).json({message:user,accesstoken})
}

export const confirmEmail=async(req,res,next)=>{
    const {email,otp} =req.body
    const user=await dbService.findOne({model:userModel,filter:{email,isConfiremed:false}})
    if(!user){
        throw new Error("this email not exist or confirmed",{cause:500})
    }

    const redis_otp=await redis_Service.getValue(`otp::${email}`)

    if(await compareSync(otp,redis_otp)){
        user.isConfiremed=true
        await user.save()
        return res.status(200).json({
            message: "Email confirmed successfully"});
    }
    


}

export const import_files=async(req,res,next)=>{
    try{
        const udated=await dbService.update({model:userModel,filter:{_id:req.user.id},newData:{age:23}})
        res.status(200).json({message:"hello",user:req.user})
    }catch(error){
        next(error)
    }
}

export const shareProfile=async(req,res,next)=>{
    const {id}=req.params
    let user=await dbService.findById({model:userModel,id,options:{password:0}})//.select("-password")
    if(!user){
        throw new Error("dosn't exist user have this id",{cause:400})
    }
    user.phone=Decrypt(user.phone)
    res.status(200).json({message:"this user",user})
}

export const getProfile=async (req,res,next)=>{
    try{
        res.status(200).json({message:"hello",user:req.user})
    }catch(error){
        next(error)
    }
}

export const updateProfile=async(req,res,next)=>{
    try{
        const {fname,lname,age,phone}=req.body
        let updateQuery={}
        if (fname !== undefined){
            updateQuery.fname=fname
        }
        if (lname !== undefined){
            updateQuery.lname=lname
        }
        if (age !== undefined){
            updateQuery.age=age
        }
        if (phone !== undefined){
            updateQuery.phone= Encrypt( phone )
        }
        const updatedUser=await dbService.update({model:userModel,filter:{_id:req.user.id},newData:updateQuery})
        res.status(200).json({message:"hello",user:updatedUser})
    }catch(error){
        next(error)
    }
}

export const updatePassword=async(req,res,next)=>{
    try{
        const {old_password,new_password,c_new_password}=req.body
        const user=await dbService.findById({model:userModel,id:req.user.id})
        const verifiedPassword=await bcrypt.compare(old_password,user.password)
        if(!verifiedPassword){
            throw new Error("invalid old password",{cause:400})
        }
        const hashpassword=await bcrypt.hash(new_password,12)
        const updatedUser=await dbService.update({model:userModel,filter:{_id:req.user.id},newData:{password:hashpassword,changeCredentialAt:new Date()}})
        
        res.status(200).json({message:"hello",user:updatedUser})
    }catch(error){
        next(error)
    }
}

export const logout =async(req,res,next)=>{
    const {flag}=req.query
    if(flag == "All"){
        req.user.changeCredentialAt=new Date()
        await req.user.save()
        await redis_Service.deleteKey(await redis_Service.keys(`revokeToken::${req.user.id}*`))
        res.status(200).json({message:'logout from all devices'})         
    }else{
            await redis_Service.setKeyValue({
                key:`revokeToken::${req.user.id}::${req.decoded.jti}`,
                value:req.decoded.jti,
                ttl:req.decoded.exp - Math.floor((Date.now() / 1000))
            })
        res.status(200).json({message:"logout from this device"})

    }
    
}










