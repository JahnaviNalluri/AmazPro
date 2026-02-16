require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDb = require("./src/config/db");

const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const cartRoutes = require("./src/routes/cartRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (err) {
        console.error("Server failed to connect", err);
    }
};

startServer();
