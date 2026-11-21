
export const validation=(schema)=>{
    return(req,res,next)=>{

        const erorrResult=[]
        for (const key of Object.keys(schema)){
            const {error}= schema[key].validate(req[key],{abortEarly:false})
            
        if(error){
            error.details.forEach(err => {
                console.log(error.details)
                console.log('-------------------------------------------------------------');
                
                //console.log(req.files)
                erorrResult.push({
                    message:err.message,
                    path:err.path[0],
                    key
                })
            });
            }
        }
        if(erorrResult.length){
            return res.status(400).json({message:"validations erorr",erorrResult})
        }
        next()
}
}



