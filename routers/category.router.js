import express from "express";
import { getCategories ,getSingleCategory, addCategory , updateCategory , deteleCategory} from "../controllers/category.controller";
const categoryrouter = express.Router();

categoryrouter.get('/get-categories',getCategories)
categoryrouter.get('/get-category/:category_id',getSingleCategory)
categoryrouter.post('/add-category',addCategory)
categoryrouter.put('/update-category/:category_id',updateCategory)
categoryrouter.delete('/delete-category/:category_id',deteleCategory)


export default categoryrouter