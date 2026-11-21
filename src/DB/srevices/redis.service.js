import { json } from "express"
import { redis_client } from "../connection.redis.js"

export const setKeyValue=async({key,value,ttl})=>{
    try{
        value=typeof value == "string" ? value : JSON.stringify(value)
        ttl?await redis_client.set(key,value,{EX:ttl}):
        await redis_client.set(key,value)
        

    }catch(error){
        console.log("redis set value faild")
    }
}

export const updateKey =async({key,value,ttl})=>{
    try{
        if(!await redis_client.exists(key)){
            return 0
        }
        await redis_client.set(key,value)
    }catch(error){
        console.log("redis update value faild")
    }
}

export const getValue=async(key)=>{
    try{
        try {
            return JSON.parse(await redis_client.get(key))
        } catch (error) {
            return await redis_client.get(key)
        }
    }catch(error){
        console.log("redis update value faild")
    }
}

export const ttl=async(key)=>{
    try{
        return await redis_client.ttl(key)
    }catch(error){
        console.log("redis ttl faild")
    }
}

export const exists=async(key)=>{
    try{
        await redis_client.exists(key)
    }catch(error){
        console.log("redis exists faild")
    }
}

export const expire=async({key,ttl})=>{
    try{
        await redis_client.expire({key,ttl})
    }catch(error){
        console.log("redis expire faild")
    }
}

export const deleteKey=async(key)=>{
    try{
        if(!key?.length){
            return 0
        }
        await redis_client.del(key)
    }catch(error){
        console.log("redis deleteKey faild")
    }
}

export const keys=async(pattern)=>{
    try{
        return await redis_client.keys(`${pattern}`)
    }catch(error){
        console.log("redis exists faild")
    }
}

export const incremnt=async(key)=>{
    try{
        await redis_client.incr(key)
    }catch(error){
        console.log("redis exists faild")
    }
}