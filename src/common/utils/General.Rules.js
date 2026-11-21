import joi from "joi"

import {Types} from "mongoose"




export const generalrules={
    id:joi.string().hex().custom((value,helpr)=>{
        return Types.ObjectId.isValid(value)?value:helpr.message
    }),
    email:joi.string().email({minDomainSegments:2,maxDomainSegments:2}),
    password:joi.string(),
    file:joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(), //////////////////multer.fileds()
        mimetype: joi.string().required(),
        path: joi.string(),
        destination: joi.string(),
        filename: joi.string(),
        size: joi.number()
    }),
    token:joi.object({
        authorization:joi.string().required(),
        connection:joi.string(),
        "accept-encoding":joi.string(),
        agent:joi.string(),
        host:joi.string(),
        postman:joi.string(),
        "user-agent":joi.string(),
        "postman-token":joi.string(),
        accept:joi.string()

    })
}

