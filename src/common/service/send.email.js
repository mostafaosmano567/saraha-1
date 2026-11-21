import nodemailer from "nodemailer";
import {randomInt, randomUUID} from 'crypto'

export const sendEmail=async({to,subject,text,html,attachments})=>{
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"mostafaosmano567@gmail.com",
            pass:"cfksoayhjhfkmhri"
        }
    }
    
    )
    const info=await transporter.sendMail({
        from:'"my saraha" <mostafaosmano567@gmail.com>',
        to,
        subject,
        text,
        html: html || "<b>hello world?</b>",
        attachments:attachments || [] ,
    })
    return info.accepted.length > 0 ? true : false
}

/* sendEmail({
    to:"ugfgftchtc@gmail.com",
    subject:"email comfirm",
    html:"<h1>hello</h1>",
    attachments:[
    {
        fileName : "photo.png",
        path: resolve("src/uploads/users/0dca3e20-1bd3-44ca-9563-f80df1aec19d__بطه.jpg")
    }

]}) */


export const generate_otp= async()=>{
    

    return randomInt(100000,1000000).toString()
}


