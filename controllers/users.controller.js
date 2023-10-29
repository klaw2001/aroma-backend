import userModel from "../models/user.model";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import fs from "fs";
import path from "path";
import multer from "multer";
import bcrypt from "bcrypt";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./uploads";
    const subfolder = "newFolder";

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

export const getAllUsers = async (req, res) => {
  try {
    const userData = await userModel.find();
    if (userData) {
      return res.status(200).json({
        data: userData,
        message: "Success",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const user = await userModel.findOne({ _id: userID });
    if (user) {
      return res.status(200).json({
        data: user,
        msg: "sucesss",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addUser = (req, res) => {
  try {
    const uploadUserImage = upload.single("avatar");
    uploadUserImage(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const { email, password, role } = req.body;
      let avatar = null;
      if (req.file !== undefined) {
        avatar = req.file.filename;
      }
      // const saltRounds = 10;

      const hashPassword = bcrypt.hashSync(password, 10);
      const userData = new userModel({
        email,
        password: hashPassword,
        role,
      });
      userData.save();
      if (userData) {
        return res.status(201).json({
          data: userData,
          message: "User Added Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const uploadData = upload.single("avatar");
    uploadData(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const userID = req.params.user_id;
      const {
        firstname,
        lastname,
        email,
        password,
        contact,
        dateofbirth,
        gender,
        about,
        role,
      } = req.body;

      const userData = await userModel.findOne({ _id: userID });

      let avatar = userData ? userData.avatar : null;

      if (req.file !== undefined) {
        avatar = req.file.filename;
        if (userData && fs.existsSync("./uploads/newFolder" + userData.avatar)) {
          fs.unlinkSync("./uploads/newFolder" + userData.avatar);
        }
      }
      let hashPassword = userData ? userData.password : null;
      if (password) {
        hashPassword = bcrypt.hashSync(password, 10);
      }
      const updatedData = await userModel.updateOne(
        { _id: userID },
        {
          $set: {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashPassword,
            contact: contact,
            dateofbirth: dateofbirth,
            gender: gender,
            about: about,
            avatar: avatar,
            role: role,
          },
        }
      );

      if (updatedData.acknowledged) {
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

export const deleteUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const user = await userModel.findOne({ _id: userID });

    let avatar = user.avatar;

    if (req.file !== undefined) {
      avatar = req.file.filename;
      if (fs.existsSync(`../uploads/newFolder/${user.avatar}`)) {
        fs.unlinkSync(`../uploads/newFolder/${user.avatar}`);
      }
    }

    const removeUser = await userModel.deleteOne(user);
    if (removeUser.acknowledged) {
      return res.status(200).json({
        message: "User Deleted!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const uploadUserImage = upload.single("avatar");
    uploadUserImage(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const { firstname, lastname, email, password, contact } = req.body;
      let avatar = null;
      if (req.file !== undefined) {
        avatar = req.file.filename;
      }

      const existUser = await userModel.findOne({ email: email });
      if (existUser) {
        return res.status(400).json({
          msg: "User Already Exists.",
        });
      }

      const hashPassword = bcrypt.hashSync(password, 10);
      const userData = new userModel({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashPassword,
        contact: contact,
        dateofbirth: dateofbirth,
        gender: gender,
        about: about,
        avatar: avatar,
        otp: otp,
      });
      userData.save();
      if (userData) {
        return res.status(201).json({
          data: userData,
          message: "Successfully Registered",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password} = req.body;

    const existUser = await userModel.findOne({ email: email });
    if (!existUser) {
      return res.status(400).json({
        message: "User Does Not Exists!",
      });
    }

    const passwordCompare = await bcrypt.compare(password, existUser.password);
    if (!passwordCompare) {
      return res.status(400).json({
        message: "Invalid Credientials!",
      });
    }

    const token = jwt.sign(
      {
        id: existUser._id,
        email: existUser.email,
      },
      "mysecretkey",
      { expiresIn: "1h" }
    );

    var cookies = new Cookies(req, res);
    cookies.set("users", JSON.stringify(existUser));

    return res.status(200).json({
      data: existUser,
      success: true,
      status:'active',
      token: token,
      message: "Login Successful!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user with the provided email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User Does Not Exist!",
      });
    }

    // Check if the user has admin privileges (role === 'admin')
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    // Compare the provided password with the stored hash
    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      return res.status(400).json({
        message: "Invalid Credentials!",
      });
    }

    // Generate a JWT token for the admin
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role, // Include the role in the token payload
      },
      "mysecretkey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      data: user,
      token: token,
      success: true,
      message: "Admin Login Successful!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
