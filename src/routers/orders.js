const express = require("express");

const Order = require("../models/Order");
const { orderValidation } = require("../validations/order");
const pagination = require("../middlewares/pagination");

const router = express.Router();

router.get("/", pagination(Order), async (req, res) => {
  try {
    res.json(res.result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { error } = orderValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const data = {
    seqId: Math.floor(100000 + Math.random() * 900000).toString(),
    ...req.body,
  };

  const post = new Order(data);
  try {
    const order = await post.save();
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const orderExist = await Order.findById(id);
  if (!orderExist) return res.status(400).send({ message: "Order not found" });

  orderExist.status = req.body.status;

  try {
    const data = await orderExist.save();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
