import { Router } from "express";
import ProductModel from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const {
            limit = 10,
            page = 1,
            sort,
            query
        } = req.query;

        let filter = {};

        if (query) {
            if (query === "true" || query === "false") {
                filter.status = query === "true";
            } else {
                filter.category = query;
            }
        }

        const options = {
            page: Number(page),
            limit: Number(limit),
            lean: true
        };

        if (sort) {
            options.sort = {
                price: sort === "asc" ? 1 : -1
            };
        }

        const result = await ProductModel.paginate(filter, options);

        res.render("home", {
            products: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage
                ? `/?page=${result.prevPage}&limit=${limit}`
                : null,
            nextLink: result.hasNextPage
                ? `/?page=${result.nextPage}&limit=${limit}`
                : null
        });

    } catch (error) {
        res.status(500).send("Error cargando productos");
    }
});

export default router;