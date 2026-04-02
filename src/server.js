import express from "express";
import mongoose from "mongoose";

import productsRouter from "routes/products.router.js";
import cartsRouter from "routes/carts.router.js";

const app = express();
const PORT = 8080;

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.log(err));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
    console.log (`Servidor corriendo en puerto ${PORT}`);
});
