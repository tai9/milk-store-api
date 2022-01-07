const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");

const Order = require("../models/Order");

const myCache = new NodeCache({ stdTTL: 10 });

router.get("/", async (req, res) => {
  try {
    if (myCache.has("statistics")) {
      return res.json(myCache.get("statistics"));
    }

    const result = await Order.find({ status: "Completed" });
    let totalEarning = 0;

    result.forEach((order) => {
      totalEarning += order.totalPayment;
    });

    const resJson = {
      totalEarning,
      totalOrder: result.length,
    };
    myCache.set("statistics", resJson);
    res.json(resJson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const getTotalPaymentByMonth = (data) => {
  let months = Array.from(Array(12)).fill(0);
  let total = 0;
  data.forEach((order) => {
    const monthIndex = new Date(order.createdDate).getMonth();
    months[monthIndex] += order.totalPayment;
    total += order.totalPayment;
  });
  return { months, total };
};

router.get("/invoices", async (req, res) => {
  try {
    if (myCache.has("statistics/invoices")) {
      return res.json(myCache.get("statistics/invoices"));
    }

    const completedOrders = await Order.find({ status: "Completed" });
    const processingOrders = await Order.find({ status: "Processing" });
    const canceledOrders = await Order.find({ status: "Canceled" });

    let completedInvoices = getTotalPaymentByMonth(completedOrders);
    let processingInvoices = getTotalPaymentByMonth(processingOrders);
    let canceledInvoices = getTotalPaymentByMonth(canceledOrders);

    const resJson = {
      totalPayment:
        completedInvoices.total +
        processingInvoices.total +
        canceledInvoices.total,
      series: [
        {
          name: "Completed",
          data: completedInvoices.months,
        },
        {
          name: "Processing",
          data: processingInvoices.months,
        },
        {
          name: "Canceled",
          data: canceledInvoices.months,
        },
      ],
    };
    myCache.set("statistics/invoices", resJson);
    res.json(resJson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
