const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const sentimentSchema = new mongoose.Schema({
  feedback: {
    type: Number,
  },
  givenByUserId: {
    type: String,
  },
});

const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: [2, "Minimum 2 characters required"],
      },
      lastname: {
        type: String,
        minlength: [3, "Minimum 3 characters required"],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: [6, "Minimum 6 characters required"],
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["faculty", "it-team", "admin"],
      default: "faculty",
    },
    userImage: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    sentiments: [sentimentSchema],
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
    userVenue: {
      type: String,
      enum: ["Block A", "Block B", "Block C"],
    },
  },
  {
    timestamps: true,
  }
);

// Generate Auth Token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

// Hash Password
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// Compare Password (Ensure password is selected)
userSchema.methods.comparePassword = async function (password) {
  const user = await mongoose
    .model("user")
    .findById(this._id)
    .select("+password");
  if (!user) return false;
  return await bcrypt.compare(password, user.password);
};

module.exports = mongoose.model("user", userSchema);
