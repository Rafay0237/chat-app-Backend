const express = require("express");
router = express.Router();

const {
  getuser,
  Login,
  Signup,
  deleteuser,
  changePassword,
  googleLogin,
  changeUsername,
  verifyToken,
  getSearch
} = require("../controllers/user");

router.get("/:id", getuser);

router.get("/search-users/:username", getSearch);

router.delete("/", deleteuser);

router.post("/sign-up", Signup);

router.post("/login", Login);

router.post("/change-password",verifyToken, changePassword);

router.post("/change-username",verifyToken, changeUsername);

router.post("/auth/google", googleLogin);

router.delete('/delete/:id',verifyToken,deleteuser)


module.exports = router;
