const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult, cookie } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");
const cloudinary = require("../config/cloudinaryConfig.js");
const sendEmail = require("../utils/sendEmail.js");
const tokenModel = require("../models/token.model.js");
const { oauth2Client } = require("../utils/googleClient.js");
const axios = require("axios");

const isValidDomain = (email) => {
  const allowedDomains = [
    "gdgu.org",
    "gdgoenka.com",
    "gdgoenkagurugram.in",
    "gdgoenkarohtak.com",
    "gdgss.in",
    "gdgoenka.ac.in",
  ];
  const domain = email.split("@")[1];
  return allowedDomains.includes(domain);
};

module.exports.registerUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { fullname, email, password, userImage } = req.body;

  const userExist = await userModel.findOne({ email });

  if (userExist) {
    return res.status(400).json({ message: "User already exist" });
  }
  let userImageURL = null;
  if (userImage) {
    const uploadResponse = await cloudinary.uploader.upload(userImage, {
      folder: "userImage",
    });
    userImageURL = uploadResponse.secure_url;
  }

  const hashPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    fullname,
    email,
    password: hashPassword,
    userImage: userImageURL,
  });

  const token = await user.generateAuthToken();

  const token2 = await tokenModel.create({
    userId: user._id,
    token: token,
  });

  const url = `${process.env.BASE_URL}/${user.id}/verify/${token2.token}`;
  await sendEmail(user.email, "Verify Email", url);

  if (!user.verified) {
    return res.status(400).json({ message: "Email not verified" });
  }

  res.status(201).json({ user, token });
};

module.exports.verifyUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(400).json({ message: "Invalid link" });

    const token = await tokenModel.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res.status(400).json({ message: "Invalid or expired link" });

    await userModel.updateOne({ _id: user._id }, { $set: { verified: true } });
    await token.deleteOne();

    res
      .status(200)
      .json({ verified: true, message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.logoutUser = async (req, res) => {
  res.clearCookie("token");

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    await blacklistTokenModel.create({ token });
  }

  res.status(200).json({ message: "Logout successful" });
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
  if (!user.verified) {
    return res.status(400).json({ message: "Email not verified" });
  }
  const token = await user.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ user, token });
};

module.exports.loginWithGoogle = async (req, res, next) => {
  const code = req.query.code;
  try {
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;
    // if (!isValidDomain(email)) {
    //   return res.status(403).json({ message: "Unauthorized email domain" });
    // }
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        fullname: {
          firstname: name,
        },
        email,
        userImage: picture,
        googleId: userRes.data.id, // Store Google ID
        password: undefined, // Avoid `null` values in Mongoose
        verified: true,
      });
    }
    const token = await user.generateAuthToken();

    res.cookie("token", token);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    console.log("google login error : ", error);
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error.response.data.message);
  }
};
module.exports.getUsersDetails = async (req, res, next) => {
  try {
    const {_id} = req.user;
    const users = await userService.getUsersDetails(_id);
    res.status(200).json(users);
  } catch (error) {
    console.log(error.response.data.message);
  }
};

module.exports.updateUserProfile = async (req, res, next) => {
  const {
    userId,
    role,
    todayAcceptedTickets,
    todayCompletedTickets,
    totalAcceptedTickets,
    totalCompletedTickets,
    sentiments,
    userVenue,
  } = req.body;

  const updateUser = await userService.updateUserProfile({
    userId,
    role,
    todayAcceptedTickets,
    todayCompletedTickets,
    totalAcceptedTickets,
    totalCompletedTickets,
    sentiments,
    userVenue,
  });

  res.status(200).json(updateUser);
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blacklistTokenModel.create({ token });

  res.status(200).json({ message: "Logout successfully" });
};
