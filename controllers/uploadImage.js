const users = require("../models/user");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");


cloudinary.config({
  cloud_name: "dgxcvannc",
  api_key: "316958841918178",
  api_secret: "KUnNI1sHQp9RMvAUJAei6mhn-Xk",
});

let uploadImage=async (req, res) => {
    try {
      const userId = req.body.id;
     const dp=req.files['image'][0];
      if (!dp)
        return res.status(400).json({ error: "No File to Upload" });

      const tempFilePath = path.join(
        __dirname,
        "../uploads/profilePicture",
        dp.originalname
      );
      fs.writeFileSync(tempFilePath, dp.buffer);

      const result = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: "image",
        crossorigin: "anonymous",
      });
      if (!result) {
        return res
          .status(400)
          .send({ error: "Cloudinary Image uploading Error !" });
      }

      fs.unlinkSync(tempFilePath);

      const updateUser = await users.findByIdAndUpdate(
        userId,
        { profilePicture: result.secure_url },
        { new: true }
      );

      if (!updateUser) {
        return res.status(400).send({ error: updateUser });
      }
      res.status(200).json({ url: result.secure_url, success: true });
    } catch (error) {
      console.error("Error processing file upload:", error);
      res.status(500).json({ error:"Some error occurred, please try again later"});
    }
}

module.exports={uploadImage}