const express = require("express");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const router = express.Router({ mergeParams: true });

router.use("/auth", require("./auth.router"));

router.use("/user", require("./user.router"));

router.use("/items", require("./items.router"));

router.use("/cart", require("./cart.router"));

router.use("/admin", require("./admin.router"));

router.use("/orders", require("./order.router"));

router.use("/feedback", require("./feedback.router"));

router.use("/news", require("./news.router"));

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

router.get("/subcategories/:category_id", async (req, res) => {
  try {
    const categoryId = req.params.category_id;

    const category = await Category.findOne({ _id: categoryId });
    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    const subcategoriesIdArray = category.subcategories;

    const subcategories = await Subcategory.find({
      _id: { $in: subcategoriesIdArray },
    });

    res.status(200).json(subcategories);
  } catch (error) {
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

module.exports = router;
