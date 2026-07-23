const User = require("../model/UserModel");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } else {
      res.status(401).json({ message: "Not Authorized, token failed!" });
    }
  } catch (error) {
    res.status(401).json({ message: "Not Authorized, token not found!" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Not authozied, admin only!" });
    }
  } catch (error) {
    res.status(403).json({ message: "Not authozied!" });
  }
};

module.exports = { protect, isAdmin };
