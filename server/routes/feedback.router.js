const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../middleware/auth.middleware");
const Feedback = require("../models/Feedback");
const { descriptionValidate, titleValidate } = require("../services/regexp");

router.post("/add", async (req, res) => {
  try {
    const { name, text } = req.body;
    if (!name || !text) {
      return res.status(400).json({ message: "Не все поля поля заполнены" });
    }
    if (name.length > 50 || text.length > 1000) {
      return res.status(404).json({ message: "Превышен лимит по символам" });
    }
    if (!titleValidate(name) || !descriptionValidate(text)) {
      return res.status(404).json({
        message: "Имя или текст отзыва содержат недопустимые символы",
      });
    }
    await Feedback.create({
      name,
      text,
    });

    res.status(200).json({ message: "Отзыв успешно дабавлен" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
