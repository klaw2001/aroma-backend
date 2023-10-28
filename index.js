import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routers/user.router";
import categoryrouter from "./routers/category.router";
import subcategoryRouter from "./routers/subcategory.router";

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.static(__dirname));

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

async function main() {
  const uri = process.env.DATABASE

  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log("could not connect to mongodb",err);
    });
}
main();

app.listen(PORT, () => {
  console.log("Your server running on http://localhost:" + PORT);
});
app.use('/users',userRouter)
app.use('/category',categoryrouter)
app.use('/sub-category',subcategoryRouter)