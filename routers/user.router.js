import express from "express";
import { getAllUsers , addUser , updateUser , deleteUser , getSingleUser , signUp , signIn, adminSignIn} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get('/getusers',getAllUsers)
userRouter.get('/get-single-user/:user_id',getSingleUser)
userRouter.post('/adduser',addUser)
userRouter.put('/update-user/:user_id',updateUser)
userRouter.delete('/delete-user/:user_id',deleteUser)

userRouter.post('/sign-up',signUp)
userRouter.post('/sign-in',signIn)
userRouter.post('/admin-sign-in', adminSignIn);

export default userRouter