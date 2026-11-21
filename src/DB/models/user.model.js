import mongoose from "mongoose";
import { providerEnum,genderEnum,userEnum } from "../../common/enum/user.enum.js";


const userSchema= new mongoose.Schema(
    {fname:{
            type:String,
            required:true,
            trim:true,
            minlength:3,
            maxlength:15
        },
        lname:{
            type:String,
            required:true,
            trim:true,
            minlength:3,
            maxlength:15
        },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:function(){
            return this.provider=="system"?true:false
        },
        //trim:true,
        //lowercase:true
    },
    phone:{
        type:String
    },
    age:{
        type:Number,
        required:function(){
            return this.provider=="system"?true:false
        },
        min:18,
        max:60
    },
    gendare:{
        type:String,
        enum:Object.values(genderEnum),
        default:genderEnum.male
    },profileImage:{
        type:String
    },coverImages:{
        type:[String]
    },
    files:{
        type:Array
    },  
    provider:{
        type:String,
        enum:Object.values(providerEnum),
        default:providerEnum.system
    },
    role:{
        type:String,
        enum:Object.values(userEnum),
        default:userEnum.user
    },
    changeCredentialAt:{
        type:Date
    },
    isConfiremed:{
        type:Boolean,
        default:false
    }
        },{timestamps:true,
            strict:true,
            strictQuery:true,
            toJSon:{virtuals:true},
            toObject:{virtuals:true}
        })

const userModel=mongoose.model("user",userSchema)
export default userModel