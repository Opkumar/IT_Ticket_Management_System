const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  // ticketId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  // },
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
     required: true
     },
  typeIssue: {
     type: String,
      required: true 
    },
  issueImage: { 
    type: String, 
    required: false
 },
  issueDetail: { 
    type: String, 
    required: true 
  },
  issueAddress: { type: String, required: true },
  urgent: { type: Boolean, default: false },
  acceptedTicketByUserId: { type: String },
  submissionTime: { type: Date, default: Date.now },
  startWorkingOnTicketIssueTime: { type: Date, default: null },
  reachAddressIssueTime: { type: Date, default: null },
  solvingIssueTime: { type: Date, default: null },
  completedTime: { type: Date, default: null },
  assigned: { type: Boolean, default: false },
  startToTicket: { type: Boolean, default: false },
  reachIssueAddress: { type: Boolean, default: false },
  solvingIssue: { type: Boolean, default: false },
  completedIssueByIt: { type: Boolean, default: false },
  completedIssue: { type: Boolean, default: false },
});

module.exports = mongoose.model("ticket", ticketSchema);
