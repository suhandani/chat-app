const {
    login,
    register,
    getAllUsers,
  } = require("../controllers/userController");

  const { addMessage, getMessages } = require("../controllers/messageController");
  
  const router = require("express").Router();
  
  router.post("/login", login);
  router.post("/register", register);
  router.get("/allusers/:username", getAllUsers);
  router.post("/addmsg", addMessage);
  router.post("/getmsg", getMessages);
  
  module.exports = router;