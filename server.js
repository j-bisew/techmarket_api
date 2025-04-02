require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const productRoutes = require("./src/routes/productRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const userRoutes = require("./src/routes/userRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const errorHandler = require("./src/middleware/errorMiddleware");
const notFound = require("./src/middleware/notFoundMiddleware");
const db = require("./src/config/db");
const initOrm = require("./src/config/initOrm");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

db.initDbFromSql();

initOrm()
  .then(success => {
    if (success) {
      console.log('ORM configured and ready to use');
    } else {
      console.warn('ORM initialization had issues, check logs');
    }
  })
  .catch(err => {
    console.error('Failed to initialize ORM:', err);
  });

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes); // New cart routes

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the TechMarket API" });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});