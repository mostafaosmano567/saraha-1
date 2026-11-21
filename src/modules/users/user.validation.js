import joi from "joi"
import { generalrules } from "../../common/utils/General.Rules.js"
import { authorization } from "../../common/middleware/authorization.js"

export const userValidationSchemaSignup= {
    body:joi.object({
        
        fname:joi.string().alphanum().min(1).max(10).messages({ 'any.required':"send first name",'string.max':"first name must be less then 10 charcher"}).required(),
        lname:joi.string().required(),
        email:joi.string().email().required(),
        password:joi.string().required(),
        profileimage:joi.string(),
        //array:joi.array().items(joi.number(),joi.string()),
        cpassword:joi.string().valid(joi.ref('password')),
        phone:joi.string(),
        age:joi.number().required()
        //date:joi.date().greater("now").required(),
        //date:joi.date().less("now").required()
    }).with("password","cpassword").or("email","phone").required(),
    /*
    file:joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(), //////////////////multer.single()
        path: joi.string(),
        destination: joi.string(),
        filename: joi.string(),
        size: joi.number()
    }).messages({'any.required':"profile image is required"}).required()
    files:joi.array().items(
        joi.object({
            fieldname: joi.string().required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(), //////////////////multer.array()
            mimetype: joi.string().required(),
            path: joi.string(),
            destination: joi.string(),
            filename: joi.string(),
            size: joi.number()
        }).messages({'any.required':"profile image is required"}).required()).required()*/
        files:joi.object({
            attachments:joi.array().items(
                generalrules.file.required()
        ),
            attachment:joi.array().items(
                generalrules.file.required()
            ).required()
        }),

    query:joi.object({flag:joi.string().required()}).required()
}


export const userValidationSchemaSignin={
    body:joi.object({
        email:generalrules.email.required(),
        password:generalrules.password.required()
    }).required()
}

export const refreshTokenSchema={
    headers:generalrules.token.required()
}

export const shareProfileSchema={
    params:joi.object({
        id:generalrules.id.required()
    }).required()
}

export const updateProfileSchema={
    body:joi.object({
        fname:joi.string().alphanum().min(1).max(10).messages({ 'any.required':"send first name",'string.max':"first name must be less then 10 charcher"}),
        lname:joi.string(),
        phone:joi.string(),
        age:joi.number()  
    })
        
}
export const updatePasswordSchema={
    body:joi.object({
        old_password:joi.string().required(),
        new_password:joi.string().required(),
        c_new_password:joi.string().valid(joi.ref("new_password")).required()
    })
    
}