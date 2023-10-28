import categoryModel from "../models/category.model";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./uploads";
    const subfolder = "category";

    // Create "uploads" folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    // Create subfolder inside "uploads"
    const subfolderPath = path.join(uploadPath, subfolder);
    if (!fs.existsSync(subfolderPath)) {
      fs.mkdirSync(subfolderPath);
    }

    cb(null, subfolderPath);
  },
  filename: function (req, file, cb) {
    const name = file.originalname; // abc.png
    const ext = path.extname(name); // .png
    const nameArr = name.split("."); // [abc,png]
    nameArr.pop();
    const fname = nameArr.join("."); //abc
    const fullname = fname + "-" + Date.now() + ext; // abc-12345.png
    cb(null, fullname);
  },
});

const upload = multer({ storage: storage });

export const getCategories = async (req, res) => {
  try {
    const categoryData = await categoryModel.find();
    if (categoryData) {
      return res.status(200).json({
        data: categoryData,
        message: "Success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addCategory = (req, res) => {
  try {
    const uploadImage = upload.single("image");
    uploadImage(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const { name } = req.body;
      let image = null;
      if (req.file !== undefined) {
        image = req.file.filename;
      }

      const categoryData = new categoryModel({
        name: name,
        image: image,
      });
      categoryData.save();
      if (categoryData) {
        return res.status(201).json({
          data: categoryData,
          message: "Category Added Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const uploadImage = upload.single("image");
    uploadImage(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const categoryID = req.params.category_id;
      const { name } = req.body;

      const categoryData = await categoryModel.findOne({ _id: categoryID });
      let image = categoryData.image;
      if (req.file !== undefined) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/category/" + categoryData.image)) {
          fs.unlinkSync("./uploads/category/" + categoryData.image);
        }
      }

      const updatedData = await categoryModel.updateOne(
        { _id: categoryID },
        {
          $set: {
            name: name,
            image: image,
          },
        }
      );

      if(updatedData.acknowledged){
        return res.status(200).json({
            message: "Updated",
          });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deteleCategory = async(req,res) =>{
    try {
        const categoryID = req.params.category_id;
        const category = await categoryModel.findOne({_id:categoryID})
    
        let image = category.image;
    
        if (req.file !== undefined) {
            image = req.file.filename;
            if (fs.existsSync("./uploads/category/" + category.image)) {
              fs.unlinkSync("./uploads/category/" + category.image);
            }
          }

          const deleteCat = await categoryModel.deleteOne(category)
          if(deleteCat.acknowledged){
            return res.status(200).json({
                message: "Category Deleted!",
              });
          }
        
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

export const getSingleCategory = async(req,res)=>{
    try {
        const categoryID = req.params.category_id
        const categoryData = await categoryModel.findOne({_id:categoryID});
        if (categoryData) {
        return res.status(200).json({
            data: categoryData,
            message: "Success",
      });
    }
        
    } catch (error) {
        return res.status(500).json({
            message: error.message,
          });
    }
}