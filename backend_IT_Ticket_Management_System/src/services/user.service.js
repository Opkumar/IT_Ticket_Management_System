const userModel = require("../models/user.model");

module.exports.createUser = async ({
  fullname,
  email,
  password,
  userImage,
}) => {
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

module.exports.updateUserProfile = async ({
  userId,
  role,
  todayAcceptedTickets,
  todayCompletedTickets,
  totalAcceptedTickets,
  totalCompletedTickets,
  sentiments,
  userVenue,
}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Construct update object dynamically
  const updateFields = {};
  if (role !== undefined) updateFields.role = role;
  if (todayAcceptedTickets !== undefined) updateFields.todayAcceptedTickets = todayAcceptedTickets;
  if (todayCompletedTickets !== undefined) updateFields.todayCompletedTickets = todayCompletedTickets;
  if (totalAcceptedTickets !== undefined) updateFields.totalAcceptedTickets = totalAcceptedTickets;
  if (totalCompletedTickets !== undefined) updateFields.totalCompletedTickets = totalCompletedTickets;
  if (userVenue !== undefined) updateFields.userVenue = userVenue;

  if (sentiments !== undefined) {
    if (!Array.isArray(sentiments)) {
      throw new Error("Sentiments must be an array");
    }

    // Validate each sentiment before adding
    const validSentiments = sentiments.filter(
      (s) => s.feedback !== undefined && s.givenByUserId
    );

    if (validSentiments.length > 0) {
      updateFields.$push = { sentiments: { $each: validSentiments } };
    }
  }

  // Find user and update in a single DB query
  const updatedUser = await userModel.findByIdAndUpdate(userId, updateFields, {
    new: true, // Return the updated document
    runValidators: true, // Ensure schema validation
  });

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};


module.exports.getUsersDetails = async (currentUserId) => {
  if (!currentUserId) {
    throw new Error("Current user ID is required");
  }

  const users = await userModel.find({ _id: { $ne: currentUserId } });

  return users;
};


