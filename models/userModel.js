const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    cellno:String,
    workno:String,
    address:String,
    website:String,
    title:String,
    org:String,
    city:String,
    state:String,
    country:String,
    pinCode:String

})

module.exports=mongoose.model("UserModel",userSchema)