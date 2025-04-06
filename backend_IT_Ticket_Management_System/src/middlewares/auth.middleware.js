const userModel = require("../models/user.model");
const blacklistTokenModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  try {
    const token =
    req.headers.authorization?.split(" ")[1] ||
    req.cookies.token ||
    req.body?.token;

     if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token not found" });
    }

    // Check if the token is blacklisted
    const isBlacklistToken = await blacklistTokenModel.findOne({ token });
    if (isBlacklistToken) {
      return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (!user.verified) {
      return res.status(401).json({ message: "Unauthorized: Email not verified" });
    }

    req.user = user; // Store user data for future use
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
