const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema({
  ticketRaisedbyId: {
    type: String,
    required: true,
  },
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [2, "minimum 3 characters required"],
    },
    lastname: {
      type: String,
      minlength: [3, "minimum 3 characters required"],
    },
  },
  email: {
    type: String,
    required: true,
  },
  components: [
     { type: String, required: true }
  ],

  startingDate: {
    type: Date,
    required: true,
  },
  startingTime: {
    type: String,
    required: true,
  },
  endingDate: {
    type: Date,
    required: true,
  },
  endingTime: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  
  acceptedTicketByUserId: {
    type: String,
    default: null,
  },
  assigned: {
    type: Boolean,
    default: false,
  },
  assignedTime: {
    type: Date,
    default: null,
  },
  completedRequirement: {
    type: Boolean,
    default: false,
  },
  completedRequirementTime: {
    type: Date,
    default: null,
  }
});

module.exports = mongoose.model("requirement", requirementSchema);
