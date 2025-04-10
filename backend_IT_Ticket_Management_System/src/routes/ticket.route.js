const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const ticketController = require("../controllers/ticket.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { ticketUpload } = require("../middlewares/multerConfig");

router.post(
  "/create",
  ticketUpload,
  [
    body("typeIssue")
      .isLength({ min: 3 })
      .withMessage("minimum 3 characters required"),
    body("issueDetail")
      .isLength({ min: 6 })
      .withMessage("minimum 6 characters required"),
    body("issueAddress")
      .isLength({ min: 3 })
      .withMessage("minimum 3 characters required"),
  ],
  authMiddleware.authUser,
  ticketController.createTickets
);
router.get("/user-tickets",authMiddleware.authUser,ticketController.getUserTickets)
router.get("/all", authMiddleware.authUser, ticketController.getAllTickets);
// router.get("/my-tickets", authMiddleware.authUser, ticketController.getMyTickets);

router.post("/update", authMiddleware.authUser, ticketController.updateTickets);
module.exports = router;