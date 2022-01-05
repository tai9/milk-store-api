const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv/config");

// Import Routes
const productsRoute = require("./routers/products");
const ordersRoute = require("./routers/orders");
const authRoute = require("./routers/auth");
const verifyToken = require("./middlewares/verifyToken");

const app = express();

// Connect mongoose DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to DB")
);

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Route middlewares
app.use("/api/user", authRoute);
app.use("/api/products", verifyToken, productsRoute);
app.use("/api/orders", verifyToken, ordersRoute);

app.get("/", (req, res) => {
  res.send("Hello api");
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
