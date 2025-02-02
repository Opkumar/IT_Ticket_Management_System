const userModel = require("../models/user.model");
// const userService = require("../services/user.service");
const userService = require("../services/user.service");
const { validationResult, cookie } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { fullname, email, password } = req.body;
  

  const userExist = await userModel.findOne({ email });

  if (userExist) {
    return res.status(400).json({ message: "User already exist" });
  }
  const userImage = req.file ? req.file.path : null;

  const hashPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    fullname,
    email,
    password: hashPassword,
    userImage
  });

  const token = await user.generateAuthToken();
  res.status(201).json({ user, token });
};

module.exports.loginUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = await user.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ user, token });
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.updateUserProfile = async (req, res, next) => {
  const {
    role,
    todayAcceptedTickets,
    todayCompletedTickets,
    totalAcceptedTickets,
    totalCompletedTickets,
  } = req.body;

  const user = req.user;

  if (role) {
    user.role = role;
  }

  if (todayAcceptedTickets) {
    user.todayAcceptedTickets = todayAcceptedTickets;
  }

  if (todayCompletedTickets) {
    user.todayCompletedTickets = todayCompletedTickets;
  }

  if (totalAcceptedTickets) {
    user.totalAcceptedTickets = totalAcceptedTickets;
  }

  if (totalCompletedTickets) {
    user.totalCompletedTickets = totalCompletedTickets;
  }

  await user.save();

  res.status(200).json(user);
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blacklistTokenModel.create({ token });

  res.status(200).json({ message: "Logout successfully" });
};
