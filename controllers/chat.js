const messages = require("../models/message");
const conversations = require("../models/conversation");

let saveConversation = async (req, res) => {
  let newConversation = new conversations({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    let savedConversation = await newConversation.save();
    res.status(200).send({ savedConversation });
  } catch (err) {
    res.status(400).send({ error: err });
  }
};
//params used..
let getConversation = async (req, res) => {
  try {
    let conversation = await conversations.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).send({ conversation });
  } catch (err) {
    res.status(400).send({ error: err });
  }
};

let saveMessage = async (req, res) => {
  const message = messages(req.body);
  try {
    const savedMessage = await message.save();
    res.status(200).send({ savedMessage });
  } catch (err) {
    res.status(400).send({ error: err });
  }
};

let getMessages = async (req, res) => {
  try {
    const messageList = await messages.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).send({ messageList });
  } catch (err) {
    res.status(400).send({ error: err });
  }
};

let UpdateSeen=async(req,res)=>{
  let {conversationId,sender}=req.body
  try{
  let updatedMessages=await messages.updateMany({conversationId,sender},{
    seen:true
  })
  if(!updatedMessages)
    return res.status(402).send({message:"some error occured",success:false})

   res.status(200).send({message:"updated",success:true})
  }catch(error){
    res.status(400).send({error:error.toString(),success:false})
  }

}

 
let removeFreind = async (req, res) => {
  let conversationId=req.params.conversationId
  
    try {
      let deletedConvo = await conversations.deleteOne({
        _id:conversationId, 
      });
      if(deletedConvo.deletedCount==0){
     return res.status(404).send({message:"Conversation not found!",deleted:false})
      }
      res.status(200).send({ deletedConvo ,deleted:true});
    } catch (err) {
      res.status(400).send({ message: err ,deleted:false});
    }
  };

let ClearChat = async (req, res) => {
  let conversationId=req.params.conversationId
  try {
    const deletedChat = await messages.deleteMany({conversationId});
    if(deletedChat.deletedCount==0){
      return  res.status(404).send({message:"Chat not found!" ,deleted:false });
    }
    res.status(200).send({ deletedChat,deleted:true });
  } catch (err) {
    res.status(400).send({ message: err,deleted:false });
  }
};


module.exports = {
  getConversation,
  saveConversation,
  saveMessage,
  getMessages,
  UpdateSeen,
  ClearChat,
  removeFreind
};
