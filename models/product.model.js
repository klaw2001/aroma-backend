import mongoose from "mongoose";
import categoryModel from "./category.model";

const Schema = mongoose.Schema;

const ProductScehma = new Schema({
  name: {
    type: String,
    default: null,
  },
  category: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: categoryModel,
  },
  quantity: {
    type: Number,
    default: null,
  },
  price: {
    type: Number,
    default: null,
  },
  saleprice:{
    type:Number,
    default:null
  },
  shortdescription: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
    maxLength: 1000,
  },
  // thumbnail: {
  //   type: String,
  //   default: null,a
  // },
  images: {
    type: [String],  // Update to an array of strings
    default: [],     // Initialize as an empty array
  },
  status: {
    type: String,
    enum: ["In Stock", "Out of Stock"],
    default: "In Stock",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Product", ProductScehma);
