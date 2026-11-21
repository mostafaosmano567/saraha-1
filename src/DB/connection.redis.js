import { createClient } from "redis"

export const redis_client = createClient({
  url: "rediss://default:gQAAAAAAAqhYAAIgcDI4NDVmOTYzMjE3MGE0ZDk4YTQ0MWViNGJjOTQzMjVlYw@assured-guinea-174168.upstash.io:6379"
});



export async function connectionRedis(){
    try{
        await redis_client.connect('mongodb://localhost:27017/saraha',{serverSelectionTimeoutMS:5000})
        console.log("redis is connected")
    }catch(error){
        console.log("redis failed")
    }
}