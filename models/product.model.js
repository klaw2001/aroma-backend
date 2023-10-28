import mongoose from "mongoose";
import categoryModel from "./category.model";
import subcategoryModel from "./subcategory.model";

const Schema = mongoose.Schema;

const ProductScehma = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: categoryModel,
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: subcategoryModel,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  shortdescription: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
    maxLength: 1000,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  images: {
    type: String,
    default: null,
  },
  status: {
    type: Array,
    enum: ["In Stock", "Out of Stock"],
    default: "In Stock",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Product", ProductScehma);
