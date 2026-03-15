import { Router } from "express";
import fs from "fs";

const router = Router();

const cartsPath = "./carts.json";
const productsPath = "./products.json";

const readFile = (path) => {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
};

const writeFile = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

const generateId = (array) => {
    return array.length ? array[array.length - 1].id + 1 : 1;
};

// crear carrito
router.post("/", (req, res) => {

    const carts = readFile(cartsPath);

    const newCart = {
        id: generateId(carts),
        products: []
    };

    carts.push(newCart);

    writeFile(cartsPath, carts);

    res.json(newCart);
});

// ver carrito
router.get("/:cid", (req, res) => {

    const carts = readFile(cartsPath);

    const cart = carts.find(c => c.id === Number(req.params.cid));

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart.products);
});

// agregar producto al carrito
router.post("/:cid/product/:pid", (req, res) => {

    const carts = readFile(cartsPath);
    const products = readFile(productsPath);

    const cart = carts.find(c => c.id === Number(req.params.cid));
    const product = products.find(p => p.id === Number(req.params.pid));

    if (!cart || !product) {
        return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }

    const existing = cart.products.find(p => p.product === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.products.push({
            product: product.id,
            quantity: 1
        });
    }

    writeFile(cartsPath, carts);

    res.json(cart);
});

export default router;