const ticketModel = require("../models/ticket.model");

module.exports.createTicket = async ({
  ticketRaisedbyId,
  fullname,
  typeIssue,
  email,
  issueDetail,
  issueAddress,
  issueImage,
  urgent,
  submissionTime,
}) => {
  if (!typeIssue || !issueDetail || !issueAddress || !ticketRaisedbyId || !fullname || !email  || !submissionTime) {
    throw new Error("All fields are required");
  }
  const ticket = ticketModel.create({
    ticketRaisedbyId,
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    typeIssue,
    issueImage,
    issueDetail,
    issueAddress,
    urgent,
    submissionTime,
  });

  return ticket;
};

module.exports.getAllTickets = async () => {
  const tickets = await ticketModel.find();
  return tickets;
};

module.exports.updateTicket = async ({
  ticketId,
  acceptedTicketByUserId,
  submissionTime,
  startWorkingOnTicketIssueTime,
  reachAddressIssueTime,
  solvingIssueTime,
  completedTime,
  assigned,
  startToTicket,
  reachIssueAddress,
  solvingIssue,
  completedIssueByIt,
  completedIssue,
}) => {
  const ticket = await ticketModel.findById(ticketId);
  if (!ticket) {
    throw new Error("Ticket not found");
  }
  ticket.acceptedTicketByUserId = acceptedTicketByUserId;
  ticket.submissionTime = submissionTime;
  ticket.startWorkingOnTicketIssueTime = startWorkingOnTicketIssueTime;
  ticket.reachAddressIssueTime = reachAddressIssueTime;
  ticket.solvingIssueTime = solvingIssueTime;
  ticket.completedTime = completedTime;
  ticket.assigned = assigned;
  ticket.startToTicket = startToTicket;
  ticket.reachIssueAddress = reachIssueAddress;
  ticket.solvingIssue = solvingIssue;
  ticket.completedIssueByIt = completedIssueByIt;
  ticket.completedIssue = completedIssue;
  ticket.save();

  return ticket;
};

