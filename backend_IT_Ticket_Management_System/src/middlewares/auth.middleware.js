const userModel = require("../models/user.model");
const blacklistTokenModel = require("../models/blacklistToken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token){
        return res.status(401).json({message:"Unauthorized"})
    }

    const isBlacklistToken = await blacklistTokenModel.findOne({token:token});
    if (isBlacklistToken){
        return res.status(401).json({message:"Unauthorized"})
    }

    try {
        const userId =jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(userId._id);
        req.user = user;
        next();
        
    } catch (error) {
        return res.status(401).json({message:"Unauthorized"})
        
    }
}