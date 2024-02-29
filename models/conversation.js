const mongoose=require("mongoose")

const ConversationSchema=new mongoose.Schema({
members:{
    type:Array
},
},{timestamps:true})

 const conversations=mongoose.model("conversations",ConversationSchema)

 module.exports=conversations

