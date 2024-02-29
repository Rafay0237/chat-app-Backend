const express=require("express")
const router=express.Router()

const {getConversation,saveConversation,saveMessage,getMessages}=require("../controllers/chat")

router.get("/conversation/:userId",getConversation)

router.post("/conversation",saveConversation)

router.get("/messages/:conversationId",getMessages)

router.post("/messages",saveMessage)

module.exports=router