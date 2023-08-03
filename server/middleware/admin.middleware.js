const config = require("config");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  try {
    const userId = req.user._id;

    const currentUser = await User.findOne({ _id: userId });

    if (!userId || !currentUser || currentUser.role !== "admin") {
      return res.status(401).json({ message: "Отказано" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Отказано" });
  }
};
