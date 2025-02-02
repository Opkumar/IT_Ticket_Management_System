const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");

const userShema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: [2, "minimum 2 characters required"],
      },
      lastname: {
        type: String,
        minlength: [3, "minimum 3 characters required"],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lovercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "minimum 6 characters required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["faculty","it-executive", "it-admin-executive", "admin"],
      default: "faculty",
    },
    userImage: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    sentiments: [
      {
        type: Number,
      },
    ],
    todayAcceptedTickets: {
      type: Number,
      default: 0,
    },
    todayCompletedTickets: {
      type: Number,
      default: 0,
    },
    totalAcceptedTickets: {
      type: Number,
      default: 0,
    },
    totalCompletedTickets: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userShema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

userShema.statics.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

userShema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model("user", userShema);
