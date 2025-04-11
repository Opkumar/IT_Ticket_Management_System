const ticketModel = require("../models/ticket.model");
const { io } = require("../config/socket");



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
  const ticket = await ticketModel.create({
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

  if (io) {
    io.emit("createTicket", ticket);
    console.log("✅ Ticket created emitted via socket.");
  }

  return ticket;
};

module.exports.getUserTickets = async (userId) => {
  const tickets = await ticketModel.find({ticketRaisedbyId:userId});
  return tickets;
};
module.exports.getAllTickets = async () => {
  const tickets = await ticketModel.find();
  return tickets;
};

module.exports.updateTicket = async (data) => {
  try {
    const {
      ticketId,
      acceptedTicketByUserId,
      submissionTime,
      assignedAt,
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
      userIssueReason,
      resolvingIssue,
      userIssueReasonDetail,
      resolvingIssueTime,
      completedIssueByItTime,
    } = data;

    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Only update fields that are provided
    if (acceptedTicketByUserId !== undefined) ticket.acceptedTicketByUserId = acceptedTicketByUserId;
    if (submissionTime !== undefined) ticket.submissionTime = submissionTime;
    if (assignedAt !== undefined) ticket.assignedAt = assignedAt;
    if (startWorkingOnTicketIssueTime !== undefined) ticket.startWorkingOnTicketIssueTime = startWorkingOnTicketIssueTime;
    if (reachAddressIssueTime !== undefined) ticket.reachAddressIssueTime = reachAddressIssueTime;
    if (solvingIssueTime !== undefined) ticket.solvingIssueTime = solvingIssueTime;
    if (completedTime !== undefined) ticket.completedTime = completedTime;
    if (assigned !== undefined) ticket.assigned = assigned;
    if (startToTicket !== undefined) ticket.startToTicket = startToTicket;
    if (reachIssueAddress !== undefined) ticket.reachIssueAddress = reachIssueAddress;
    if (solvingIssue !== undefined) ticket.solvingIssue = solvingIssue;
    if (completedIssueByIt !== undefined) ticket.completedIssueByIt = completedIssueByIt;
    if (completedIssue !== undefined) ticket.completedIssue = completedIssue;
    if (userIssueReason !== undefined) ticket.userIssueReason = userIssueReason;
    if (resolvingIssue !== undefined) ticket.resolvingIssue = resolvingIssue;
    if (userIssueReasonDetail !== undefined) ticket.userIssueReasonDetail = userIssueReasonDetail;
    if (resolvingIssueTime !== undefined) ticket.resolvingIssueTime = resolvingIssueTime;
    if (completedIssueByItTime !== undefined) ticket.completedIssueByItTime = completedIssueByItTime;

    // Save the updated ticket
    await ticket.save();

    // Emit update via socket
    
    if (io) {
      io.emit("ticketUpdates", ticket);
      console.log("✅ Ticket update emitted via socket.");
    } else {
      console.warn("⚠️ Socket.io instance not available.");
    }

    return ticket;
  } catch (error) {
    console.error("🔥 Error in updateTicket:", error.message);
    throw error;
  }
};
// module.exports.updateTicket = async ({
//   ticketId,
//   acceptedTicketByUserId,
//   submissionTime,
//   assignedAt,
//   startWorkingOnTicketIssueTime,
//   reachAddressIssueTime,
//   solvingIssueTime,
//   completedTime,
//   assigned,
//   startToTicket,
//   reachIssueAddress,
//   solvingIssue,
//   completedIssueByIt,
//   completedIssue,
//   userIssueReason,
//   resolvingIssue,
//   userIssueReasonDetail,
//   resolvingIssueTime,
//   completedIssueByItTime,
// }) => {
//   const ticket = await ticketModel.findById(ticketId);
//   if (!ticket) {
//     throw new Error("Ticket not found");
//   }

//   // Update only if the field is provided (not undefined)
//   if (acceptedTicketByUserId !== undefined) ticket.acceptedTicketByUserId = acceptedTicketByUserId;
//   if (submissionTime !== undefined) ticket.submissionTime = submissionTime;
//   if (assignedAt !== undefined) ticket.assignedAt = assignedAt;
//   if (startWorkingOnTicketIssueTime !== undefined) ticket.startWorkingOnTicketIssueTime = startWorkingOnTicketIssueTime;
//   if (reachAddressIssueTime !== undefined) ticket.reachAddressIssueTime = reachAddressIssueTime;
//   if (solvingIssueTime !== undefined) ticket.solvingIssueTime = solvingIssueTime;
//   if (completedTime !== undefined) ticket.completedTime = completedTime;
//   if (assigned !== undefined) ticket.assigned = assigned;
//   if (startToTicket !== undefined) ticket.startToTicket = startToTicket;
//   if (reachIssueAddress !== undefined) ticket.reachIssueAddress = reachIssueAddress;
//   if (solvingIssue !== undefined) ticket.solvingIssue = solvingIssue;
//   if (completedIssueByIt !== undefined) ticket.completedIssueByIt = completedIssueByIt;
//   if (completedIssue !== undefined) ticket.completedIssue = completedIssue;
//   if (userIssueReason !== undefined) ticket.userIssueReason = userIssueReason;
//   if (resolvingIssue !== undefined) ticket.resolvingIssue = resolvingIssue;
//   if (userIssueReasonDetail !== undefined) ticket.userIssueReasonDetail = userIssueReasonDetail;
//   if (resolvingIssueTime !== undefined) ticket.resolvingIssueTime = resolvingIssueTime;
//   if (completedIssueByItTime !== undefined) ticket.completedIssueByItTime = completedIssueByItTime;

//   await ticket.save();
//     // io.emit("ticketUpdates", ticket);
//     getIO().emit("ticketUpdates", ticket);
//     console.log("Ticket updates emitted to socket");

//   return ticket;
// };


