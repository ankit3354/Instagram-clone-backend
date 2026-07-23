const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    //  Check if user already exits
    const UserExits = await User.findOne({ email });
    if (UserExits) {
      return res.status(400).json({ message: "User already Exits!" });
    }

    //   Create new User
    const newUser = await User.create({
      userName,
      email,
      password,
    });

    if (newUser) {
      return res.status(201).json({
        message: "User Created Successfully!",
        _id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.matchPassword(password)) {
      return res.status(200).json({
        message: "Login Sucessfullly!",
        _id: user._id,
        userName: user.userName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Incorrect email or Password!" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

module.exports = userRouter;
