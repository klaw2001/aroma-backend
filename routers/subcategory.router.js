import express from "express";
import { getsubcategory ,getSingleSubCategory, addsubcategory , updateSubCategory , deleteSubCategory} from "../controllers/subcategory.controller";
const subcategoryRouter = express.Router();

subcategoryRouter.get('/get-sub-category',getsubcategory)
subcategoryRouter.post('/add-sub-category',addsubcategory)
subcategoryRouter.get('/get-single-sub-category/:subcategory_id',getSingleSubCategory)
subcategoryRouter.put('/update-sub-category/:subcategory_id',updateSubCategory)
subcategoryRouter.delete('/delete-sub-category/:subcategory_id',deleteSubCategory)

export default subcategoryRouter