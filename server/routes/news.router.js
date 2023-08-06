const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../middleware/auth.middleware");
const News = require("../models/News");
const Image = require("../models/Image");
const deleteImage = require("../services/deleteImage");

router.post("/add", async (req, res) => {
  try {
    const { photo_name } = req.body;

    const newPost = await News.create({
      photo_name,
    });

    res
      .status(200)
      .json({ message: "Новость успешно добавлена", element: newPost });
  } catch (error) {
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

router.delete("/delete/:news_id", async (req, res) => {
  try {
    const { news_id } = req.params;

    const currentPost = await News.findOne({ _id: news_id });
    const photo_name = currentPost.photo_name;

    await News.deleteOne({ _id: news_id });
    await deleteImage([photo_name]);

    res.status(200).json({ message: "Новость успешно удалена" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

module.exports = router;
