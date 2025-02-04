const requirementService = require("../services/requirement.service");
const { validationResult } = require("express-validator");
const requirementModel = require("../models/requirement.model");

module.exports.createRequirement = async (req, res, next) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const {
      components,
      startingDate,
      startingTime,
      endingDate,
      endingTime,
      address,
    } = req.body;
    const { _id: ticketRaisedbyId, fullname, email } = req.user;

    const requirement = await requirementService.createRequirement({
      ticketRaisedbyId,
      fullname,
      email,
      components,
      startingDate,
      startingTime,
      endingDate,
      endingTime,
      address,
    });

    res.status(201).json(requirement);
  } catch (error) {
    console.error("Requirement Creation Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getAllRequirements = async (req, res, next) => {
  try {
    const requirements = await requirementService.getAllRequirements();
    res.status(200).json(requirements);
  } catch (error) {
    console.error("Get All Requirements Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.updateRequirement = async (req, res, next) => {
  try {
    const {
      acceptedTicketByUserId,
      assigned,
      assignedTime,
      completedRequirement,
      completedRequirementTime,
    } = req.body;
    const { role } = req.user;

    if (
      role !== "admin" ||
      role !== "it-executive" ||
      role !== "it-admin-executive"
    ) {
      return res.status(401).json({ message: "Unauthorized for update tickets or requirements" });
    }

    const requirement = await requirementService.updateRequirement({
      acceptedTicketByUserId,
      assigned,
      assignedTime,
      completedRequirement,
      completedRequirementTime,
    });

    res.status(200).json(requirement);
    
  } catch (error) {
    console.error("Update Requirement Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
