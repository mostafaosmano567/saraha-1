import multer from "multer"
import fs from "node:fs"
import {resolve} from "path"
import {randomUUID} from 'crypto'

export const readystorage=({customPath="genral",customTypes=[]})=>{
    const fullPath=`src/uploads/${customPath}`
    if (!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath,{recursive:true})
    }
    const storage=multer.diskStorage({
        destination:
        (req,file,cb)=>{
            cb(null,fullPath)
        },
        filename:
        (req,file,cb)=>{
            cb(null,randomUUID()+"__"+file.originalname)}
    })
    function fileFilter(req,file,cb){
        if(!customTypes.includes(file.mimetype)){
            cb(new Error("Invald file"))
        }else{
            cb(null,true)
        }
    }



    return multer({storage})
}
/*

export const Multer=()=>{
    const storage = multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,"src/uploads")
        },
        filename:(req,file,cb)=>{
            cb(null,randomUUID()+"__"+file.originalname)
        }
    })
    const upload = multer({storage})
    return upload

}
*/