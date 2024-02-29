const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat")
const requestRoutes=require("./routes/request")
const uplaodImageRoutes=require("./routes/uploadImage")

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

const port = process.env.Port || 3000;
const host = process.env.Host || "0.0.0.0";
let MongodbConnectionURI = process.env.CONNECTION_URI;

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: "*"
}));

async function dbConnection() {
  await mongoose.connect(MongodbConnectionURI);
  console.log("Connected To Database");
}
dbConnection().catch((err) => console.error(err));

app.listen(port, host, () => {
  console.log("Server Is Listening ");
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Chat App Back-End ");
});

app.use("/users", userRoutes);

app.use("/chat",chatRoutes);

app.use("/request",requestRoutes);

app.use("/upload-dp",uplaodImageRoutes);

