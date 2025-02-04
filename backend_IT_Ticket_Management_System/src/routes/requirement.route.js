const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const requirementController = require("../controllers/requirement.controller");
const { body } = require("express-validator");

router.post(
  "/create",
  [// Validate components as an array with at least one object
    body("components")
    .isArray({ min: 1 }) // ✅ Ensure it's an array with at least 1 string
    .withMessage("Components must be an array with at least one element"),

  body("components.*") // ✅ Validate each element in the array
    .isString()
    .isLength({ min: 2 })
    .withMessage("Each component must be a string with at least 2 characters"),
    // Fix date validation: Ensure it's a valid ISO string
    body("startingDate")
      .isString()
      .isISO8601()
      .withMessage("Starting date must be a valid ISO 8601 date (YYYY-MM-DD or full timestamp)"),
    
    body("endingDate")
      .isString()
      .isISO8601()
      .withMessage("Ending date must be a valid ISO 8601 date (YYYY-MM-DD or full timestamp)"),

    // Validate time and address
    body("startingTime")
      .isString()
      .withMessage("Starting time must be a string"),

    body("endingTime")
      .isString()
      .withMessage("Ending time must be a string"),

    body("address")
      .isString()
      .withMessage("Address must be a string"),],
  authMiddleware.authUser,
  requirementController.createRequirement
);

router.get(
  "all",
  authMiddleware.authUser,
  requirementController.getAllRequirements
);

router.post("/update", authMiddleware.authUser, requirementController.updateRequirement);

module.exports = router;
