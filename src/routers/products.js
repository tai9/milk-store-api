const express = require("express");
const multer = require("multer");

const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const storageRef = admin.storage().bucket(`gs://milk-store-55eb1.appspot.com`);

async function uploadFile(path, filename) {
  // Upload the File
  const storage = await storageRef.upload(path, {
    public: true,
    destination: `/uploads/${filename}`,
    metadata: {
      firebaseStorageDownloadTokens: uuidv4(),
    },
  });
  return storage[0].metadata.mediaLink;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({ storage });
const Product = require("../models/Product");
const { productValidation } = require("../validations/product");
const pagination = require("../middlewares/pagination");

const router = express.Router();

router.get("/", pagination(Product), async (req, res) => {
  try {
    res.json(res.result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", upload.single("productImage"), async (req, res) => {
  const url = await uploadFile(req.file.path, req.file.filename);
  const data = {
    ...req.body,
    preview: url,
  };
  const { error } = productValidation(data);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const productExist = await Product.findOne({ name: req.body.name });
  if (productExist)
    return res.status(400).send({ message: "Product already exist" });

  const post = new Product(data);
  try {
    const product = await post.save();
    res.json(product);
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
