const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  seqId: {
    type: String,
    required: false,
  },
  customerName: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPayment: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "processing",
  },
  products: {
    type: Array,
    required: true,
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

module.exports = mongoose.model("Order", OrderSchema);
