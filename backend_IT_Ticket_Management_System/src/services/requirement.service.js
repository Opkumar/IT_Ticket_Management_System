const requirementModel = require("../models/requirement.model");

module.exports.createRequirement = async ({
  ticketRaisedbyId,
  fullname,
  email,
  components,
  startingDate,
  startingTime,
  endingDate,
  endingTime,
  address,
}) => {
  if (
    !ticketRaisedbyId ||
    !fullname ||
    !email ||
    !components ||
    !startingDate ||
    !startingTime ||
    !endingDate ||
    !endingTime ||
    !address
  ) {
    throw new Error("All fields are required");
  }
  const requirement = await requirementModel.create({
    ticketRaisedbyId,
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    components,
    startingDate,
    startingTime,
    endingDate,
    endingTime,
    address,
  });

  return requirement;
};

module.exports.getUserRequirements = async (userId) => {
  const requirements = await requirementModel.find({
    ticketRaisedbyId: userId,
  });
  return requirements;
};

module.exports.getAllRequirements = async () => {
  const requirements = await requirementModel.find();
  return requirements;
};

module.exports.updateRequirement = async ({
  requirementId,
  acceptedTicketByUserId,
  assigned,
  assignedTime,
  completedRequirement,
  completedRequirementTime,
}) => {
  const requirement = await requirementModel.findById(requirementId);
  if (!requirement) {
    throw new Error("Requirement not found");
  }

  // Update only if the field is provided (not undefined)
  if (acceptedTicketByUserId !== undefined) requirement.acceptedTicketByUserId = acceptedTicketByUserId;
  if (assigned !== undefined) requirement.assigned = assigned;
  if (assignedTime !== undefined) requirement.assignedTime = assignedTime;
  if (completedRequirement !== undefined) requirement.completedRequirement = completedRequirement;
  if (completedRequirementTime !== undefined) requirement.completedRequirementTime = completedRequirementTime;

  await requirement.save();
  return requirement;
};

