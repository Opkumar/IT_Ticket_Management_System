const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { UserUpload } = require("../middlewares/multerConfig");

router.post("/signup",UserUpload,[
    body("fullname.firstname").isLength({min:2}).withMessage("minimum 2 characters required"),
    body("email",).isEmail().withMessage("email is required"),
    body("password",).isLength({min:6}).withMessage("minimum 6 characters required"),
],userController.registerUser);


router.post("/login",[
    body("email",).isEmail().withMessage("email is required"),
    body("password",).isLength({min:6}).withMessage("minimum 6 characters required"),
],userController.loginUser);

router.get("/profile",authMiddleware.authUser,userController.getUserProfile);
router.post("/update",authMiddleware.authUser,userController.updateUserProfile);
router.get("/logout",authMiddleware.authUser,userController.logoutUser);

module.exports = router;
