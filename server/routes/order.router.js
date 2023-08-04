const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router({ mergeParams: true });

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const {
      locality,
      street,
      house,
      entrance,
      floor,
      apartmentNumber,
      buyer,
      phone,
      comment = "",
    } = req.body;
    if (
      !locality ||
      !street ||
      !house ||
      !entrance ||
      !floor ||
      !apartmentNumber ||
      !buyer ||
      !phone
    ) {
      return res
        .status(400)
        .json({ message: "Не все поля заполнены для создания заказа." });
    }

    const { _id } = req.user;
    const currentUser = await User.findOne({ _id });
    if (!currentUser) {
      return res.status(200).json({ message: "Пользователь не найден." });
    }

    const newOrder = await Order.create({
      locality,
      street,
      house,
      entrance,
      floor,
      apartmentNumber,
      buyer,
      phone,
      comment,
    });

    currentUser.orders.push(newOrder._id);
    await currentUser.save();

    res
      .status(200)
      .json({ message: "Заказ успешно создан.", element: newOrder });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее." });
  }
});

router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    console.log(req.user);
    const { orderId } = req.body;
    await Order.deleteOne({ _id: orderId });

    const { _id } = req.user;

    const currentUser = await User.findOne({ _id });

    const filteredOrders = currentUser.orders.filter(
      (order) => order.toString() !== orderId.toString()
    );
    currentUser.orders = filteredOrders;

    currentUser.markModified("orders");
    await currentUser.save();

    res
      .status(200)
      .json({ message: "Заказ успешно удален.", element: currentUser });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "На сервере произошла ошибка. Попробуйте позднее." });
  }
});

module.exports = router;
