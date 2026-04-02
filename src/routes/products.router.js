import {Router} from "express";
import ProductModel from "../models/product.model.js";

const router= Router();

router.get("/", async (req, res) => {
    try{
        const {
            limit= 10,
            page=1,
            sort,
            query
        } = req.query;

        let filter = {};

        //filtrado de categoria o stock disponible
        if(query) {
            if(query === "true" || query === "false") {
                filter.status = query === "true";
            } else {
                filter.category = query;
            }
        }
        
        const options = {
        page:Number(page),
        limit: Number(limit),
        lean: true
        };

        //orden por precio
        if (sort) {
            options.sort = {
                price: sort === "asc" ? 1 : -1
            };
        }

        const result = await ProductModel.paginate(filter, options);

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage
                ? `/apiproducts?page=${result.prevPage}`
                : null,
            nextLink: result.hasNextPage
                ? `/api/products?page=${result.nextPage}`
                : null
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

export default router;