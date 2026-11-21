import {hashSync,compareSync} from"bcrypt";



export const hash=async(plainText,saltRounds)=>{
    return hashSync(plainText,saltRounds)
}
export const compare= async(password,hash)=>{
    return compareSync(password,hash)
}