const mongoose=require("mongoose")

const requestSchema= new mongoose.Schema({
    userId:{
        type:String
    },
    requests:{
        type:Array
    }
},{timestamps:true})

const Requests=mongoose.model("requests",requestSchema)

module.exports=Requests