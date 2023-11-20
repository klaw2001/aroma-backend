import mongoose from "mongoose";
import categoryModel from "./category.model";
import productModel from "./product.model";
import userModel from "./user.model";
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  productID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Cart", CartSchema);
