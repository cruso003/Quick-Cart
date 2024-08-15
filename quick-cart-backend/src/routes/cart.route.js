import express from "express";
import { createCartItem, deleteCartItem, deleteCartItems, getCartItems } from "../controllers/cart.controller.js";

const router = express.Router();

//get user cart items
router.get('/user/:userId', getCartItems);

//create cart item
router.post('/', createCartItem);

//delete cart item by id
router.delete('/:id', deleteCartItem);

//delete all cart items
router.delete('/', deleteCartItems);

export default router;
