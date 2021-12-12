const express = require("express");
const Post = require("../models/Post");
const verifyToken = require("./verifyToken");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const data = await Post.find();
    res.json(data);
  } catch (err) {
    res.status(500);
  }
});

router.post("/", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
  });
  try {
    const data = await post.save();
    console.log(post, data);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

module.exports = router;
