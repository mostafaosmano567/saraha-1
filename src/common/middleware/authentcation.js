import jwt from "jsonwebtoken"
import { findOne } from "../../DB/srevices/DB.service.js"
import userModel from "../../DB/models/user.model.js"
import * as dbService from "../../DB/srevices/DB.service.js";
import revokeTokenModel from "../../DB/models/refokeToken.model .js";
import { redis_client } from "../../DB/connection.redis.js";
import * as redis_service from "../../DB/srevices/redis.service.js";


export const authentication = async (req,res,next)=>{
    const {authorization} =req.headers
    if(!authorization){
        throw new Error("token not exist",{cause:400})
    }
    const decoded = jwt.verify(authorization,"secret")
    if (!decoded){
        throw new Error("failed in decoded",{cause:400})
    }
    
    const user = await findOne({model:userModel,filter:{_id : decoded.id}})
    if(!user){
        throw new Error("invalid id",{cause:400})
    }
    console.log(user.changeCredentialAt.getTime())
    console.log(decoded)
    if (user?.changeCredentialAt?.getTime() > decoded.iat*1000){
        throw new Error('token expired you must be login again',{cause:400})
    }
     
/*     if(await dbService.findOne({model:revokeTokenModel,
        filter:{revokeTokenId:decoded.jti}
    })){
        throw new Error('You have been logged out of this device must be login again',{cause:400})
    } */
   console.log(await redis_service.ttl(`revokeToken::${user.id}${decoded.jti}`))
   if(await redis_service.ttl(`revokeToken::${user.id}${decoded.jti}`) > 0 ){
    throw new Error('You have been logged out of this device must be login again',{cause:400})
   }
    req.decoded=decoded
    req.user=user
    next()
}


