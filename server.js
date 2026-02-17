import express from "express";
import fs from "fs"; 
import path from "path";

const app= express();
const PORT= 8080;

app.use (express.json());

//ruta de archivos
const productsPath = path.join(__dirname, "products.json");
const cartsPath = path.join(__dirname, "carts.json");

//inicialización de archivos

if (!fs.existsSync(productsPath)) {
    const initialProducts = [
        { id: 1, nombre: "Remera", precio: 3000 },
        { id: 2, nombre: "Short", precio: 10000 },
        { id: 3, nombre: "Pantalón", precio: 17000 }
    ];
    fs.writeFileSync(productsPath, JSON.stringify(initialProducts, null, 2));
}

if (!fs.existsSync(cartsPath)) {
    fs.writeFileSync(cartsPath, JSON.stringify([], null, 2));
}

// funciones de apoyo

const readFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const writeFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const generateId = (array) => {
    return array.length > 0 ? array[array.length - 1].id + 1 : 1;
};

// router products

const productsRouter = express.Router();

// GET todos los productos
productsRouter.get("/", (req, res) => {
    const products = readFile(productsPath);
    res.json(products);
});

// GET producto por id
productsRouter.get("/:pid", (req, res) => {
    const products = readFile(productsPath);
    const product = products.find(p => p.id === Number(req.params.pid));

    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
});

// POST nuevo producto
productsRouter.post("/", (req, res) => {
    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    } = req.body;

    if (!title || !description || !code || price == null || stock == null || !category) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const products = readFile(productsPath);

    const newProduct = {
        id: generateId(products),
        title,
        description,
        code,
        price,
        status: status ?? true,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    products.push(newProduct);
    writeFile(productsPath, products);

    res.status(201).json(newProduct);
});

// PUT actualizar producto
productsRouter.put("/:pid", (req, res) => {
    const products = readFile(productsPath);
    const index = products.findIndex(p => p.id === Number(req.params.pid));

    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    // No permitir modificar id
    delete req.body.id;

    products[index] = {
        ...products[index],
        ...req.body
    };

    writeFile(productsPath, products);

    res.json(products[index]);
});

// DELETE producto
productsRouter.delete("/:pid", (req, res) => {
    const products = readFile(productsPath);
    const filteredProducts = products.filter(p => p.id !== Number(req.params.pid));

    if (products.length === filteredProducts.length) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    writeFile(productsPath, filteredProducts);

    res.json({ message: "Producto eliminado correctamente" });
});


// router carts

const cartsRouter = express.Router();

// POST crear carrito
cartsRouter.post("/", (req, res) => {
    const carts = readFile(cartsPath);

    const newCart = {
        id: generateId(carts),
        products: []
    };

    carts.push(newCart);
    writeFile(cartsPath, carts);

    res.status(201).json(newCart);
});

// GET productos de un carrito
cartsRouter.get("/:cid", (req, res) => {
    const carts = readFile(cartsPath);
    const cart = carts.find(c => c.id === Number(req.params.cid));

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart.products);
});

// POST agregar producto a carrito
cartsRouter.post("/:cid/product/:pid", (req, res) => {
    const carts = readFile(cartsPath);
    const products = readFile(productsPath);

    const cartIndex = carts.findIndex(c => c.id === Number(req.params.cid));
    if (cartIndex === -1) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productExists = products.find(p => p.id === Number(req.params.pid));
    if (!productExists) {
        return res.status(404).json({ error: "Producto no existe" });
    }

    const productIndex = carts[cartIndex].products.findIndex(
        p => p.product === Number(req.params.pid)
    );

    if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity += 1;
    } else {
        carts[cartIndex].products.push({
            product: Number(req.params.pid),
            quantity: 1
        });
    }

    writeFile(cartsPath, carts);

    res.json(carts[cartIndex]);
});

// uso de las rutas

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// servidor

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});