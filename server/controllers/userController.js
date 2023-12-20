const User = require("../models/userModel");

module.exports.register = async (req, res, next) => {
    try {
      const { username } = req.body;
      const usernameCheck = await User.findOne({ username });
      if (usernameCheck)
        return res.json({ msg: "Username already used", status: 0 });
      const user = await User.create({
        username,
      });
      return res.json({ status: 1, user });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.login = async (req, res, next) => {
    try {
      const {username} = req.body;
      const user = await User.findOne({ username });
      if (!user)
        return res.json({ msg: "Incorrect Username", status: 0 });
      return res.json({ status: 1, user });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({ username: { $ne: req.params.username } }).select([
        "username"
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };