








export const findOne = async ({model,filter,options={} }={})=>{
    return await model.findOne(filter,options)
}

export const create=async ({model,data})=>{
    return await model.create([data])
}
export const update=async({model,filter,newData})=>{
    return await model.findOneAndUpdate(filter,{$set:newData},{returnDocument: "after",runValidators: true})
}

export const findById = async ({model,id,options={}}={})=>{
    return await model.findById(id,options)
}
