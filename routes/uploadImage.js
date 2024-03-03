const express=require("express")
const multer = require("multer");

const {uploadImage}=require("../controllers/uploadImage")

const router=express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/",upload.fields([{ name: "image" }, { name: "id" }]),uploadImage)

module.exports=router