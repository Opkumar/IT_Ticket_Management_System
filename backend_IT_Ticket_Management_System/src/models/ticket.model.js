const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
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
  typeIssue: {
    type: String,
    required: true,
  },
  issueImage: {
    type: String,
    required: false,
  },
  issueDetail: {
    type: String,
    required: true,
  },
  issueAddress: { type: String, required: true },
  urgent: {
    type: String,
    enum: ["normal", "moderate", "urgent"],
    default: "normal",
  },
  acceptedTicketByUserId: { type: String, default: null },
  submissionTime: { type: Date, default: Date.now() },
  assignedAt: { type: Date, default: null },
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
  userIssueReason: {
    type: Boolean,
    default: false,
  },
  resolvingIssue: {
    type: Boolean,
    default: false,
  },
  userIssueReasonDetail: {
    type: String,
    default: null,
  },
  resolvingIssueTime:{
    type:Date,
    default: null,
  },
  completedIssueByItTime:{
    type:Date,
    default: null,
  },
  
});

module.exports = mongoose.model("ticket", ticketSchema);
