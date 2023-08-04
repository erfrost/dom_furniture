const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../middleware/auth.middleware");
const Feedback = require("../models/Feedback");

router.post("/add", async (req, res) => {
  try {
    const { name, text } = req.body;
    if (!name || !text) {
      return res.status(400).json({ message: "Не все поля поля заполнены." });
    }

    await Feedback.create({
      name,
      text,
    });

    res.status(200).json({ message: "Отзыв успешно дабавлен." });
  } catch (error) {
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { feedbackId } = req.body;

    const currentFeedback = await Feedback.findOne({ _id: feedbackId });
    if (!currentFeedback) {
      return res
        .status(400)
        .json({ message: "Отзыв с указанным id не найден." });
    }

    await currentFeedback.delete();

    res.status(200).json({ message: "Отзыв успешно удален." });
  } catch (error) {
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

module.exports = router;
