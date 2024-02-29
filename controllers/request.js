const Requests = require("../models/request");
const conversations = require("../models/conversation");
const users = require("../models/user");

let sendRequest = async (req, res) => {
  let userId = req.body.userId;
  let senderId = req.body.senderId;

    const found = await conversations.findOne({
      members: { $all: [senderId,userId] }
    });
    if (found)
      return res.status(200).send({ message: "User already added!" });

  try {
    let user = await Requests.findOne({ userId });
    if (!user) {
      user = new Requests({ userId, requests: [senderId] });
    } else {
      let found = user.requests.includes(senderId);
      if (found) {
        return res.status(200).send({ message: "Request is sent already" });
      } else {
        user.requests.push(senderId);
      }
    }
    const savedData = await user.save();
    res.status(200).send({ savedData });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

let getRequests = async (req, res) => {
  try {
    const requestsList = await Requests.findOne({ userId: req.params.userId });
    if (!requestsList)
      return res.status(404).send({ message: "No requests against this id" });
    const userList = await users.find({
      _id: { $in: requestsList.requests },
    });
    userList.forEach(user=>{user.password===null})
    res.status(200).send({ userList });
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

let acceptRequest = async (req, res) => {
  let newConversation = new conversations({
    members: [req.body.userId, req.body.senderId],
  });
  try {
    await newConversation.save();
  } catch (err) {
    console.log(err);
  }
  try {
    let updatedReqs = await Requests.updateOne(
      { userId: req.body.userId },
      { $pull: { requests: req.body.senderId } }
    );
    res.status(200).send({ updatedReqs });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

let deleteRequest = async (req, res) => {
  try {
    let updatedReqs = await Requests.updateOne(
      { userId: req.body.userId },
      { $pull: { requests: req.body.senderId } }
    );
    res.status(200).send({ updatedReqs });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

module.exports = { sendRequest, acceptRequest, deleteRequest, getRequests };
