import cartModel from "../models/cart.model";
import productModel from "../models/product.model";
import dotenv from "dotenv";
dotenv.config();

const stripe = require("stripe")(process.env.SECRET_KEY);

export const checkoutCart = async (req, res) => {
  const { products } = req.body;

  console.log(products);
  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.quantity,
  }));
  const session = await stripe.checkout.sessions.create({
    // payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/",
    cancel_url: "http://localhost:3000/",
  });
  console.log(session)
  if (session.success_url === true) {
    console.log(session.payment_status);
  }

  res.json({
    id: session.id,
    status: session.status,
    paymentStatus: session.payment_status,
    data:products
  });
};
export const getCartItems = async (req, res) => {
  try {
    const customers = await stripe.customers.list({
      limit: 3,
    });
    // console.log(customers)
    const userID = req.params.user_id;
    const cartData = await cartModel.find({ userID: userID });
    if (cartData) {
      return res.status(200).json({
        data: cartData,
        message: "Success",
        customers:customers,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addCartItem = async (req, res) => {
  try {
    const { userID, productID } = req.body;
    const proData = await productModel.findOne({ _id: productID });

    const existCartItem = await cartModel.findOne({
      productID: productID,
      userID: userID,
    });
    if (existCartItem) {
      let quantity = existCartItem.quantity + 1;
      const updatedItem = await cartModel.updateOne(
        { _id: existCartItem._id },
        {
          $set: {
            quantity: quantity,
          },
        }
      );
      if (updatedItem.acknowledged) {
        return res.status(200).json({
          data: updatedItem,
          message: "updated",
        });
      }
    }

    const cartData = new cartModel({
      userID: userID,
      productID: productID,
      name: proData.name,
      price: proData.price,
      quantity: 1,
      thumbnail: proData.thumbnail,
    });
    cartData.save();
    console.log(cartData);
    if (cartData) {
      return res.status(201).json({
        data: cartData,
        message: "Product Successfully added to Cart",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const cartID = req.params.cart_id;
    const { updatetype } = req.query;
    const cartData = await cartModel.findOne({ _id: cartID });

    let quantity = cartData.quantity;

    if (updatetype === "increment") {
      quantity += 1;
    }
    if (updatetype === "decrement") {
      quantity -= 1;
    }

    const updatedItem = await cartModel.updateOne(
      { _id: cartID },
      {
        $set: {
          quantity: quantity,
        },
      }
    );

    if (updatedItem.acknowledged) {
      return res.status(200).json({
        message: "Updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const cartID = req.params.cart_id;

    const deletedItem = await cartModel.deleteOne({ _id: cartID });
    if (deletedItem.acknowledged) {
      return res.status(200).json({
        data: deletedItem,
        message: "Cart Item Deleted Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteAllCartItems = async (req, res) => {
  try {
    const userID = req.params.user_id;

    const deletedItems = await cartModel.deleteMany({ userID: userID });

    if (deletedItems.deletedCount > 0) {
      return res.status(200).json({
        data: deletedItems,
        message: "All Cart Items Deleted Successfully",
      });
    } else {
      return res.status(404).json({
        message: "No cart items found for the user.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
