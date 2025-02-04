const ticketService = require('../services/ticket.service');
const { validationResult, cookie } = require("express-validator");

module.exports.createTickets = async (req, res, next) => {
    try {
        const { typeIssue, issueDetail, issueAddress, urgent } = req.body;

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        if (!req.user) {  // Ensure user is available from auth middleware
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log(req.user);

        const issueImage = req.file ? req.file.path : null;

        const ticket = await ticketService.createTicket({
            ticketRaisedbyId: req.user._id, // Use req.user instead of undefined user
            fullname:  req.user.fullname,
            email: req.user.email,
            typeIssue,
            issueImage,
            issueDetail,
            issueAddress,
            urgent,
            submissionTime: new Date(),
        });

        res.status(201).json(ticket);
    } catch (error) {
        console.error("Ticket Creation Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports.getAllTickets = async (req, res, next) => {
    try {
        const tickets = await ticketService.getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        console.error("Get All Tickets Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.updateTickets = async (req, res, next) => {
    try {
        const {
            
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
            completedIssue
        } = req.body;
        const { role } = req.user;

        if (
            role !== "admin" ||
            role !== "it-executive" ||
            role !== "it-admin-executive"
        ) {
            return res.status(401).json({ message: "Unauthorized for update tickets or requirements" });
        }

        const ticket = await ticketService.updateTicket({
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
            completedIssue

        });

        res.status(200).json(ticket);
    } catch (error) {
        console.error("Update Ticket Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}