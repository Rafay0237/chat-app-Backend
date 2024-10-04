const express=require("express")
const multer = require("multer");

const {uploadImage,uploadImageChat}=require("../controllers/uploadImage")

const router=express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/",upload.fields([{ name: "image" }, { name: "id" }]),uploadImage)

router.post("/chat",upload.fields([{ name: "image" }]),uploadImageChat)

module.exports=router