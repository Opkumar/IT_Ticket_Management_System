const ticketService = require('../services/ticket.service');
const { validationResult, cookie } = require("express-validator");
const cloudinary = require("../config/cloudinaryConfig.js");

module.exports.createTickets = async (req, res, next) => {
    try {
        const { typeIssue, issueDetail, issueAddress, urgent ,issueImage} = req.body;

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        if (!req.user) {  
            return res.status(401).json({ message: "Unauthorized" });
        }
         let userImageURL = null;
          if (issueImage) {
            const uploadResponse = await cloudinary.uploader.upload(issueImage,{
                folder:"TicketsImage",
            });
            userImageURL = uploadResponse.secure_url;
          }

        const ticket = await ticketService.createTicket({
            ticketRaisedbyId: req.user._id, // Use req.user instead of undefined user
            fullname:  req.user.fullname,
            email: req.user.email,
            typeIssue,
            issueImage:userImageURL,
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


module.exports.getUserTickets = async (req , res ) =>{
    try {
        const {_id:userId} = req.user;
        const tickets = await ticketService.getUserTickets(userId);
        res.status(200).json(tickets);
    } catch (error) {
        console.error("Get All Tickets Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

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
        } = req.body;
        // const { role } = req.user;

        // if (
        //     role !== "admin" &&
        //     role !== "it-team" 
           
        // ) {
        //     return res.status(401).json({ message: "Unauthorized for update tickets or requirements" });
        // }

        const ticket = await ticketService.updateTicket({
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
        });

        res.status(200).json(ticket);
    } catch (error) {
        console.error("Update Ticket Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}