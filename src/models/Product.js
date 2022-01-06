const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  preview: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "Active",
  },
  expiry_date: {
    type: Date,
    default: new Date(+new Date() + 6 * 30 * 24 * 60 * 60 * 1000),
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  updated_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
