require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const productRoutes = require("./src/routes/productRoutes");
const errorHandler = require("./src/middleware/errorMiddleware");
const notFound = require("./src/middleware/notFoundMiddleware");
const db = require("./src/config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

db.initDbFromSql();


app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Products API" });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;