const express = require("express");
const router = express.Router({ mergeParams: true });
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");

router.get("/info", auth, async (req, res) => {
  try {
    const { _id } = req.user;

    const currentUser = await User.findOne({ _id });

    res.status(200).json(currentUser);
  } catch (error) {
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

module.exports = router;
