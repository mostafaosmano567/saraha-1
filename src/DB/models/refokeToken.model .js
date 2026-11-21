import mongoose from "mongoose";
/* import { providerEnum,genderEnum,userEnum } from "../../common/enum/revokeToken.enum.js"; */


const revokeTokenSchema= new mongoose.Schema({
    revokeTokenId:{
        type:String,
        required:true,
        
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    }

        },{timestamps:true,
            strict:true,
            strictQuery:true
        })
revokeTokenSchema.index({expireAt:1,expireAfterSceonds:0})
const revokeTokenModel=mongoose.model("revokeToken",revokeTokenSchema)
export default revokeTokenModel