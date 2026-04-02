import fs from "fs";

export default class ProductManager {

    constructor(path) {
        this.path = path;
    }

    // obtener productos

    async getProducts() {

        try {

            if (!fs.existsSync(this.path)) {
                return [];
            }

            const data = await fs.promises.readFile(this.path, "utf-8");

            return JSON.parse(data);

        } catch (error) {
            console.log("Error leyendo productos");
            return [];
        }
    }

    // obtener producto por id

    async getProductById(id) {

        const products = await this.getProducts();

        return products.find(p => p.id === Number(id));

    }

    // agregar producto

    async addProduct(product) {

        const products = await this.getProducts();

        const newId =
            products.length > 0
                ? products[products.length - 1].id + 1
                : 1;

        const newProduct = {
            id: newId,
            title: product.title,
            description: product.description || "",
            code: product.code || "",
            price: product.price,
            status: product.status ?? true,
            stock: product.stock || 0,
            category: product.category || "",
            thumbnails: product.thumbnails || []
        };

        products.push(newProduct);

        await fs.promises.writeFile(
            this.path,
            JSON.stringify(products, null, 2)
        );

        return newProduct;
    }

    // eliminar producto

    async deleteProduct(id) {

        const products = await this.getProducts();

        const filteredProducts = products.filter(
            p => p.id !== Number(id)
        );

        await fs.promises.writeFile(
            this.path,
            JSON.stringify(filteredProducts, null, 2)
        );

        return filteredProducts;
    }

}

