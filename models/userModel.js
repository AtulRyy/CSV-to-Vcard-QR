const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    cellno:String,
    workno:String,
    address:String,
    website:String,
    title:String,
    org:String

})

module.exports=mongoose.model("UserModel",userSchema)