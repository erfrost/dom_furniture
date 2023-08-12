const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const Item = require("../models/Item");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const News = require("../models/News");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const Image = require("../models/Image");
const deleteImage = require("../services/deleteImage");
const { titleValidate, descriptionValidate } = require("../services/regexp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${slugify(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 7 МБ
  },
});

//создание товара
router.post("/items", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category_id,
      subcategory_id,
      specifications,
      photo_names,
    } = req.body;
    if (
      !title ||
      !description ||
      !price ||
      !category_id ||
      !subcategory_id ||
      !specifications ||
      !photo_names.length
    ) {
      return res.status(404).json({ message: "Поля не должны быть пустыми" });
    }
    if (title.length > 1000 || description.length > 100) {
      return res.status(404).json({ message: "Превышен лимит по символам" });
    }
    if (!titleValidate(title)) {
      return res
        .status(404)
        .json({ message: "Название товара содержит недопустимые символы" });
    }
    if (!descriptionValidate(description)) {
      return res
        .status(404)
        .json({ message: "Описание товара содержит недопустимые символы" });
    }
    const subcategory = await Subcategory.findOne({ _id: subcategory_id });
    if (!subcategory) {
      return res.status(404).json({ message: "Подкатегория не найдена" });
    }
    if (subcategory_id.toString() !== subcategory._id.toString()) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    const newItem = await Item.create({
      title,
      description,
      price,
      category_id,
      subcategory_id,
      specifications,
    });

    subcategory.items.push(newItem);

    await subcategory.save();

    const newImages = [];
    for (const img of photo_names) {
      const newImage = await Image.findOne({
        name: img,
      });
      newImages.push(newImage.name); // Добавляем ID созданного изображения в массив newImages
    }

    newItem.photo_names = newImages; // Присваиваем массив newImages полю photo_id объекта newItem

    await newItem.save();

    res.status(200).json({ message: "Товар успешно добавлен" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//обновление товара
router.patch("/items/:item_id", async (req, res) => {
  try {
    const data = req.body;

    if (data.title.length > 1000 || data.description.length > 100) {
      return res.status(404).json({ message: "Превышен лимит по символам" });
    }

    const currentItem = await Item.findOne({ _id: req.params.item_id });
    if (!currentItem) {
      return res.status(404).json({ message: "Товар не найден" });
    }
    if (!req.body) {
      return res.status(404).json({ message: "Поля не должны быть пустыми" });
    }
    if (data.title && !titleValidate(data.title)) {
      return res
        .status(404)
        .json({ message: "Название товара содержит недопустимые символы" });
    }
    if (data.description && !descriptionValidate(data.description)) {
      return res
        .status(404)
        .json({ message: "Описание товара содержит недопустимые символы" });
    }

    const newItem = await currentItem.updateOne(req.body);
    console.log(newItem);

    res.status(200).json({ message: "Товар успешно обновлен" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//удаление товара
router.delete("/items/:item_id", async (req, res) => {
  try {
    const itemId = req.params.item_id;

    const currentItem = await Item.findOne({ _id: itemId });
    if (!currentItem) {
      return res.status(404).json({ message: "Элемент не найден" });
    }

    const subcategory = await Subcategory.findOne({
      _id: currentItem.subcategory_id,
    });
    if (!subcategory) {
      return res.status(404).json({ message: "Подкатегория не найдена" });
    }
    subcategory.items.pull(itemId);

    await subcategory.save();

    await currentItem.deleteOne();

    await deleteImage(currentItem.photo_names);

    res.status(200).json({ message: "Товар успешно удален" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//создание категории
router.post("/categories", async (req, res) => {
  try {
    const { title, photo_name } = req.body;

    if (!title || !photo_name) {
      return res.status(404).json({ message: "Поля не должны быть пустыми" });
    }
    if (title.length > 1000) {
      return res.status(404).json({ message: "Превышен лимит по символам" });
    }
    if (!nameValidate(title)) {
      return res
        .status(404)
        .json({ message: "Название категории содержит недопустимые символы" });
    }
    if (await Category.findOne({ title })) {
      return res
        .status(404)
        .json({ message: "Категория с таким названием уже существует" });
    }
    const newCategory = await Category.create({
      title,
      photo_name: photo_name[0],
    });

    res.status(200).json({ message: "Категория успешно добавлена" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//обновление категории
router.patch("/categories/:category_id", async (req, res) => {
  try {
    const { title, photo_name } = req.body;
    if (!title || !photo_name) {
      return res.status(404).json({ message: "Поля не должны быть пустыми" });
    }
    if (title.length > 1000) {
      return res.status(404).json({ message: "Превышен лимит по символам" });
    }
    if (!nameValidate(title)) {
      return res
        .status(404)
        .json({ message: "Название категории содержит недопустимые символы" });
    }
    if (await Category.findOne({ title })) {
      return res
        .status(404)
        .json({ message: "Категория с таким названием уже существует" });
    }

    const currentCategory = await Category.findOne({
      _id: req.params.category_id,
    });
    if (!currentCategory) {
      return res.status(404).json({ message: "Элемент не найден" });
    }
    if (!req.body) {
      return res.status(404).json({ message: "Поля не должны быть пустыми" });
    }

    await currentCategory.updateOne({
      title,
      photo_name: photo_name[0],
    });

    res.status(200).json({ message: "Категория успешно обновлена" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//удаление категории
router.delete("/categories/:category_id", async (req, res) => {
  try {
    const currentCategory = await Category.findOne({
      _id: req.params.category_id,
    });
    if (!currentCategory) {
      return res.status(404).json({ message: "Элемент не найден" });
    }
    const subcategoriesIdArray = currentCategory.subcategories;

    subcategoriesIdArray.map(
      async (_id) => await Item.deleteOne({ subcategory_id: _id })
    );
    subcategoriesIdArray.map(async (_id) => await Subcategory.deleteOne(_id));

    currentCategory.deleteOne(req.body);

    await deleteImage([currentCategory.photo_name]);

    res.status(200).json({ message: "Категория успешно удалена" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//создание подкатегории
router.post("/subcategories", async (req, res) => {
  try {
    const { title, photo_name, category_id } = req.body;
    if (!title || !photo_name || !category_id) {
      return res.status(404).json({ message: "Поля не должны быть пустыми" });
    }
    if (title.length > 1000) {
      return res.status(404).json({ message: "Превышен лимит по символам" });
    }
    if (!nameValidate(title)) {
      return res.status(404).json({
        message: "Название подкатегории содержит недопустимые символы",
      });
    }

    const category = await Category.findOne({ _id: category_id });
    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }
    console.log({ title, photo_name, category_id });
    const newSubcategory = await Subcategory.create({
      title,
      photo_name: photo_name[0],
      category_id,
    });
    category.subcategories.push(newSubcategory._id);

    await category.save();

    res.status(200).json({ message: "Подкатегория успешно добавлена" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

//обновление подкатегории
router.patch("/subcategories/:subcategory_id", async (req, res) => {
  try {
    const { title, photo_name } = req.body;
    if (!title || !photo_name) {
      return res.status(404).json({ message: "Поля не должны быть пустыми" });
    }
    if (title.length > 1000) {
      return res.status(404).json({ message: "Превышен лимит по символам" });
    }
    if (!nameValidate(title)) {
      return res.status(404).json({
        message: "Название подкатегории содержит недопустимые символы",
      });
    }

    const currentSubcategory = await Subcategory.findOne({
      _id: req.params.subcategory_id,
    });
    if (!currentSubcategory) {
      return res.status(404).json({ message: "Элемент не найден" });
    }

    await currentSubcategory.updateOne({ title, photo_name: photo_name[0] });

    res.status(200).json({ message: "Категория успешно обновлена" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//удаление подкатегории
router.delete("/subcategories/:subcategory_id", async (req, res) => {
  try {
    const subcategoryId = req.params.subcategory_id;

    const currentSubcategory = await Subcategory.findOne({
      _id: subcategoryId,
    });
    if (!currentSubcategory) {
      return res.status(404).json({ message: "Элемент не найден" });
    }

    const itemsIdArray = currentSubcategory.items;
    itemsIdArray.map(async (_id) => {
      await Item.deleteOne(_id);
    });

    const category = await Category.findOne({
      _id: currentSubcategory.category_id,
    });
    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    category.subcategories.pull({ _id: subcategoryId });

    await category.save();

    await currentSubcategory.deleteOne();

    await deleteImage([currentSubcategory.photo_name]);

    res.status(200).json({ message: "Подкатегория успешно удалена" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/news", async (req, res) => {
  try {
    const { photo_name } = req.body;
    console.log(photo_name);
    const newPost = await News.create({
      photo_name: photo_name[0],
    });

    res.status(200).json({ message: "Новость успешно добавлена" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/news/:news_id", async (req, res) => {
  try {
    const { news_id } = req.params;

    const currentPost = await News.findOne({ _id: news_id });
    if (!currentPost) {
      return res.status(404).json({ message: "Новость не найдена" });
    }
    const photo_name = currentPost.photo_name;

    await News.deleteOne({ _id: news_id });
    await deleteImage([photo_name]);

    res.status(200).json({ message: "Новость успешно удалена" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/uploadImage", upload.any(), async (req, res) => {
  try {
    const files = req.files;
    console.log(files);
    if (!files) {
      return res.status(400).json({ message: "Файл не был загружен" });
    }
    files.map(async (img) => {
      await Image.create({
        name: img.filename,
      });
    });

    res.status(200).json(files.map((img) => img.filename));
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
