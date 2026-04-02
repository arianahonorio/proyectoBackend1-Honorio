import { Router } from "express";
import CartModel from "../models/cart.model.js";

const router= Router();

//GET carrito con populate
router.get("/:cid", async (req,res) => {
    const cart= await CartModel.findById (req.params.cid)
        .populate("products.product");

    res.json(cart);
});

//DELETE producto del carrito
router.delete ("/:cid/products/:pid", async (req, res) =>{
    const cart= await CartModel.findById(req.params.cid);

    cart.products = cart.products.filter(
        p=> p.product.toString() !== req.params.pid
    );
    await cart.save();
    res.json(cart);
});

//PUT actualizar todo el carrito
router.put ("/:cid", async (req,res) => {
    const updatedCart = await CartModel.findByIdAndUpdate (
        req.params.cid,
        {products: req.body.products},
        {new: true}
    );
    res.json(updatedCart);
});

//PUT actualizar cantidad
router.put("/:cid/products/:pid", async (req, res) =>{
    const {quantity} =req.body;
    const cart= cart.products.find(
        p=> p.product.toString() === req.params.pid
    );
    if (product) {
        product.quantity=quantity;
    }
    await cart.save();
    res.json(cart);
});

//DELETE vaciar carrito
router.delete("/:cid", async (req, res) =>{
    const cart= await CartModel.findById(req.params.cid);
    cart.products= [];
    await cart.save();
    res.json(cart);
});

export default router;