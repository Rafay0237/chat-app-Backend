const mongoose=require("mongoose");
const users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.Secret;

let getuser = async (req, res) => {
  let userId=req.params.id
  try {
    const user = await users.findOne({_id:userId});
    res.status(200).send({user});
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

let getSearch = async (req, res) => {
  let searchedName = req.params.username;
  try {
    const user = await users.find({ userName: { $regex: searchedName, $options: "i" } });
    if (user.length === 0) {
      return res.status(200).send({ message: "No user found with the specified email." });
    }
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};


let Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found!", success: false });
    }
    let verifyPassword = await bcrypt.compare(password, user.password);
    user.password = undefined;
    if (verifyPassword) {
      const token = jwt.sign({ id: user._id, role: "user" }, secret, {
        algorithm: "HS256",
        expiresIn: "2d",
      });
      res.status(200).send({ message: "Logged in Successfully", user, token,success:true });
    } else {
      return res
        .status(400)
        .send({ message: "Invalid Password", success: false });
    }
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

let changePassword = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;

    const savedUser = await users.findOne({ email });
    if (!savedUser) {
      return res.status(404).send({ message: "User not found!" });
    }
    let verifyPassword = await bcrypt.compare(password, savedUser.password);

    if (verifyPassword) {
      let hashedPassword = await bcrypt.hash(newPassword, 7);

      await users.updateOne(
        { email: req.body.email },
        { $set: { password: hashedPassword } }
      );

      res.status(200).send({ message: "Password Changed Succesfully! ",success:true });
    } else {
      return res.status(401).send({ message: "Current Password is Invalid " });
    }
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

let changeUsername = async (req, res) => {
  const newName = req.body.userName;

  try {
    const user = await users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not Found!" });
    }

    const userNameExist = await users.findOne({ userName: newName });
    if (userNameExist) {
      return res.status(404).send({ message: "Username already Exists!" });
    }
    await users.updateOne(
      { email: req.body.email },
      { $set: { userName: newName } }
    );

    res.status(200).send({ message: "Username changed Successfully! ",success:true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

let deleteuser = async (req, res) => {
      try {
          const id=req.params.id;
          if(!mongoose.Types.ObjectId.isValid(id))
          {
              return res.status(400).send({message:"Invalid user ID",success:false})
          }
          const user=await users.deleteOne({_id:id});
          if(user.deletedCount==0)
          {
             return res.status(404).send({message:"No user against this id",success:false})
          }
          res.status(200).send(user);
      } catch (error) {
          res.status(500).send({error:error.toString()});
      }
};

let Signup = async (req, res) => {
  try {
    const userExist = await users.findOne({ email: req.body.email });
    if (userExist !== null) {
      return res.status(400).send({ message: "Email already Exists!" });
    }
    const { userName, email, password } = req.body;
    if(password.length<6 || password==='')
    {
    return res.status(400).send({ message: "Password can not be less than 6 Characters! " });
    }
    if(userName.length<4)
    {
    return res.status(400).send({ message: "Username is too Short! " });
    }
    let hashedPassword = await bcrypt.hash(password, 7);

    const user = new users({ userName, email, password: hashedPassword });
    const response = await user.save();
    response.password = undefined;
    res.status(200).send({ response, message: "User Saved Succesfully" ,success:true});
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

let googleLogin = async (req, res) => {
  try {
    const user = await users.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id, role: "user" }, secret, {
        algorithm: "HS256",
        expiresIn: "2d",
      });
      user.password = undefined;
      res.status(200).send({ message: "Logged in with Google", user, token });
    } else {
      const { userName, email, photo } = req.body;
      let randomPassword = Math.random().toString(36).slice(-8);
      let hashedPassword = await bcrypt.hash(randomPassword, 7);

      const user = new users({
        userName,
        email,
        password: hashedPassword,
        profilePicture: photo,
      });
      await user.save();
      user.password = undefined;
      const token = jwt.sign({ id: user._id, role: "user" }, secret, {
        algorithm: "HS256",
        expiresIn: "2d",
      });
      res.status(200).send({ message: "Logged in with Google", user, token });
    }
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

let verifyToken = async (req, res, next) => {
  const token = req.headers.authorization ? 
  req.headers.authorization.split(" ")[1] : null;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized User! Token not found" ,expired:true});
  }

  try {
    const decodedToken = jwt.verify(token, secret);

    if (!decodedToken) {
      return res.status(401).send({ message: "Unauthorized User! Token expired" ,expired:true});
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send({ message: "Unauthorized User! Invalid token",expired:true });
  }
};

let getChatBarData = async (req, res) => {
  let { userId } = req.params;
  try {
    let user = await users.findOne({ _id: userId });
    if (!user) return res.status(200).send({ found: false });
    return res
      .status(200)
      .send({
        profilePicture: user.profilePicture,
        userName: user.userName,
        freindId:user._id
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.toString() });
  }
};

module.exports = {
  getuser,
  Login,
  Signup,
  deleteuser,
  changePassword,
  googleLogin,
  changeUsername,
  verifyToken,
  getSearch,
  getChatBarData
};
