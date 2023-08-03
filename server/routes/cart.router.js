const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");
const Item = require("../models/Item");

router.post("/update", auth, async (req, res) => {
  try {
    const { _id } = req.user;
    const { items } = req.body;

    const currentUser = await User.findOne({ _id });

    for (const item of items) {
      const currentItem = await Item.findOne({ _id: item.itemId });

      const existingCartItem = currentUser.cart.find(
        (cartItem) => cartItem.itemId.toString() === currentItem._id.toString()
      );
      if (existingCartItem) {
        existingCartItem.count = item.count;
      } else {
        currentUser.cart.push({ itemId: currentItem._id, count: item.count });
      }
    }

    currentUser.markModified("cart"); // Обновление поля cart

    await currentUser.save();

    res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const { _id } = req.user;
    const { itemId } = req.body;

    const currentUser = await User.findOne({ _id });
    const filteredCart = currentUser.cart.filter(
      (item) => item.itemId.toString() !== itemId.toString()
    );
    currentUser.cart = filteredCart;

    currentUser.markModified("cart");
    await currentUser.save();

    res.status(200).json({
      message: "Товар успешно удален из корзины",
      element: currentUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее" });
  }
});

module.exports = router;
