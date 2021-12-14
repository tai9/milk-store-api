const express = require("express");
const Product = require("../models/Product");
const { productValidation } = require("../validations/product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (err) {
    res.status(500);
  }
});

router.post("/", async (req, res) => {
  const { error } = productValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const productExist = await Product.findOne({ name: req.body.name });
  if (productExist)
    return res.status(400).send({ message: "Product already exist" });

  const post = new Product(req.body);
  try {
    const data = await post.save();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const productExist = await Product.findById(id);
  if (!productExist)
    return res.status(400).send({ message: "Product not found" });

  const { error } = productValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  productExist.name = req.body.name;
  productExist.price = req.body.price;
  productExist.quantity = req.body.quantity;

  try {
    const data = await productExist.save();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productDeleted = await Product.findByIdAndDelete(id);
    res.json({ _id: productDeleted._id });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
