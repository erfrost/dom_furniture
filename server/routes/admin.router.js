const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const Item = require("../models/Item");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const Image = require("../models/Image");

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
    fileSize: 7 * 1024 * 1024, // 7 МБ
  },
});

//////// добавить middleware

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
      imageNames,
    } = req.body;
    if (
      !title ||
      !description ||
      !price ||
      !category_id ||
      !subcategory_id ||
      !specifications ||
      !imageNames
    ) {
      return res.status(404).json({ message: "Поля не должны быть пустыми" });
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
    for (const img of imageNames) {
      const newImage = await Image.create({
        name: img,
      });
      newImages.push(newImage.name); // Добавляем ID созданного изображения в массив newImages
    }

    newItem.photo_names = newImages; // Присваиваем массив newImages полю photo_id объекта newItem

    await newItem.save();

    res
      .status(200)
      .json({ message: "Товар успешно добавлен", element: newItem });
  } catch (error) {
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

//обновление товара
router.patch(
  "/items/:item_id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const currentItem = await Item.findOne({ id: req.params.item_id });
      if (!currentItem) {
        return res.status(404).json({ message: "Товар не найден" });
      }
      if (!req.body) {
        return res.status(404).json({ message: "Поля не должны быть пустыми" });
      }
      await currentItem.updateOne(req.body);

      res.status(200).json({ message: "Товар успешно обновлен" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
    }
  }
);

//удаление товара
router.delete(
  "/items/:item_id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
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

      res.status(200).json({ message: "Товар успешно удален" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
    }
  }
);

//создание категории
router.post(
  "/categories",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { title, photo_url } = req.body;
      if (!title || !photo_url) {
        return res.status(404).json({ message: "Поля не должны быть пустыми" });
      }
      const newCategory = await Category.create({ title, photo_url });

      res
        .status(200)
        .json({ message: "Категория успешно добавлена", element: newCategory });
    } catch (error) {
      res
        .status(400)
        .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
    }
  }
);

//обновление категории
router.patch(
  "/categories/:category_id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const currentCategory = await Category.findOne({
        id: req.params.category_id,
      });
      if (!currentCategory) {
        return res.status(404).json({ message: "Элемент не найден" });
      }
      if (!req.body) {
        return res.status(404).json({ message: "Поля не должны быть пустыми" });
      }

      await currentCategory.updateOne(req.body);

      res.status(200).json({ message: "Категория успешно обновлена" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
    }
  }
);

//удаление категории
router.delete(
  "/categories/:category_id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const currentCategory = await Category.findOne({
        id: req.params.category_id,
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

      res.status(200).json({ message: "Категория успешно удалена" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
    }
  }
);

//создание подкатегории
router.post(
  "/subcategories",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { title, photo_url, category_id } = req.body;
      if (!title || !photo_url || !category_id) {
        return res.status(404).json({ message: "Поля не должны быть пустыми" });
      }

      const category = await Category.findOne({ _id: category_id });

      if (!category) {
        return res.status(404).json({ message: "Категория не найдена" });
      }

      const newSubcategory = await Subcategory.create({
        title,
        photo_url,
        category_id,
      });
      category.subcategories.push(newSubcategory);

      await category.save();

      res.status(200).json({
        message: "Подкатегория успешно добавлена",
        element: newSubcategory,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
    }
  }
);

//обновление подкатегории
router.patch(
  "/subcategories/:subcategory_id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const currentSubcategory = await Subcategory.findOne({
        id: req.params.subcategory_id,
      });
      if (!currentSubcategory) {
        return res.status(404).json({ message: "Элемент не найден" });
      }
      if (!req.body) {
        return res.status(404).json({ message: "Поля не должны быть пустыми" });
      }
      await currentSubcategory.updateOne(req.body);

      res.status(200).json({ message: "Категория успешно обновлена" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
    }
  }
);

//удаление подкатегории
router.delete(
  "/subcategories/:subcategory_id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
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

      res.status(200).json({ message: "Подкатегория успешно удалена" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
    }
  }
);

router.post("/uploadImage", upload.any(), async (req, res) => {
  try {
    const files = req.files;
    if (!files) {
      return res.status(400).json({ message: "Файл не был загружен" });
    }

    res.status(200).json(files.map((img) => img.filename));
  } catch (error) {
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

module.exports = router;
