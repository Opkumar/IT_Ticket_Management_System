const userModel = require("../models/user.model");

module.exports.createUser = async ({ fullname, email, password ,userImage }) => {
  if (!fullname.firstname || !email || !password) {
    throw new Error("All fields are required");
  }
  const user = userModel.create({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password,
    userImage,
  });

  return user;
};
