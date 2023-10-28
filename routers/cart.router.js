import express from "express";
import { getCartItems , addCartItem , updateCartItem , deleteCartItem, checkoutCart, deleteAllCartItems} from "../controllers/cart.controller";
const cartRouter = express.Router();

cartRouter.get("/get-cart-items/:user_id",getCartItems)
cartRouter.post("/add-cart-item",addCartItem)
cartRouter.put("/update-cart-item/:cart_id",updateCartItem)
cartRouter.delete("/delete-cart-item/:cart_id",deleteCartItem)
cartRouter.delete("/delete-all-items/:user_id",deleteAllCartItems)
cartRouter.post('/checkout',checkoutCart)


export default cartRouter