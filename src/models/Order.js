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
  totalAmount: {
    type: Number,
    required: true,
  },
  totalPayment: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Processing",
  },
  products: {
    type: Array,
    required: true,
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

module.exports = mongoose.model("Order", OrderSchema);
