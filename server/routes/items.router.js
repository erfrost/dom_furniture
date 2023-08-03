const express = require("express");
const router = express.Router({ mergeParams: true });
const Item = require("../models/Item");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Image = require("../models/Image");

router.get("/", async (req, res) => {
  try {
    const allItems = await Item.find();

    res.status(200).json(allItems);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

router.get("/by_category/:category_id", async (req, res) => {
  try {
    const categoryId = req.params.category_id;

    const currentCategory = await Category.find({ _id: categoryId });
    if (!currentCategory) {
      return res.status(404).json({ message: "Проверьте параметры запроса" });
    }

    const subcategoriesIdArray = currentCategory[0].subcategories;

    const subcategories = await Item.find({
      subcategory_id: { $in: subcategoriesIdArray },
    });

    res.status(200).json(subcategories);
  } catch (error) {
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

router.get("/by_subcategory/:subcategory_id", async (req, res) => {
  try {
    const subcategoryId = req.params.subcategory_id;

    const currentSubcategory = await Subcategory.find({ _id: subcategoryId });
    if (!currentSubcategory) {
      return res.status(404).json({ message: "Проверьте параметры запроса" });
    }
    const itemsIdArray = currentSubcategory[0].items;

    const items = await Item.find({
      _id: { $in: itemsIdArray },
    });

    res.status(200).json(items);
  } catch (error) {
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

router.get("/by_itemId/:item_id", async (req, res) => {
  try {
    const itemId = req.params.item_id;

    const currentItem = await Item.find({ _id: itemId });
    if (!currentItem) {
      return res.status(404).json({ message: "Проверьте параметры запроса" });
    }

    res.status(200).json(currentItem);
  } catch (error) {
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

module.exports = router;
