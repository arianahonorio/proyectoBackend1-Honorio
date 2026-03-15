import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const productManager = new ProductManager("./products.json");

export default (io) => {

    const router = Router();

    router.get("/", async (req, res) => {
        const products = await productManager.getProducts();
        res.json(products);
    });

    router.post("/", async (req, res) => {

        const newProduct = await productManager.addProduct(req.body);

        const products = await productManager.getProducts();

        io.emit("updateProducts", products);

        res.json(newProduct);
    });

    router.delete("/:pid", async (req, res) => {

        await productManager.deleteProduct(req.params.pid);

        const products = await productManager.getProducts();

        io.emit("updateProducts", products);

        res.json({ status: "deleted" });
    });

    return router;
};