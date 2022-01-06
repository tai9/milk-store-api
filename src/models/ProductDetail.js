const mongoose = require("mongoose");

const ProductDetailSchema = mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  mfg_date: {
    type: Date,
    default: Date.now,
  },
  exp_date: {
    type: Date,
    default: Date.now,
  },
  entry_date: {
    type: Date,
    default: Date.now,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ProductDetail", ProductDetailSchema);
