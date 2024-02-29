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

module.exports = {
  getConversation,
  saveConversation,
  saveMessage,
  getMessages,
};
