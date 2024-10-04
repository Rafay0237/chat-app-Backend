const express=require("express")
const router=express.Router()

const {getConversation,saveConversation,saveMessage,getMessages,UpdateSeen, ClearChat, removeFreind}=require("../controllers/chat")

router.get("/conversation/:userId",getConversation)

router.post("/conversation",saveConversation)

router.get("/messages/:conversationId",getMessages)

router.post("/messages",saveMessage)

router.put("/messages/update-seen",UpdateSeen)

router.delete("/messages/:conversationId",ClearChat)

router.delete("/conversation/:conversationId",removeFreind)

module.exports=router