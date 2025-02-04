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
    if (!ticketRaisedbyId || !fullname || !email || !components || !startingDate || !startingTime || !endingDate || !endingTime || !address) {
        throw new Error("All fields are required");
    }
    const requirement = requirementModel.create({
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
    }

module.exports.getAllRequirements = async () => {
    const requirements = requirementModel.find();
    return requirements;
    }


module.exports.updateRequirement = async ({
    requirementId,
    acceptedTicketByUserId,
    assigned,
    assignedTime,
    completedRequirement,
    completedRequirementTime,
    }) => {
    const requirement = requirementModel.findById(requirementId);
    if (!requirement) {
        throw new Error("Requirement not found");
    }
    requirement.acceptedTicketByUserId = acceptedTicketByUserId;
    requirement.assigned = assigned;
    requirement.assignedTime = assignedTime;
    requirement.completedRequirement = completedRequirement;
    requirement.completedRequirementTime = completedRequirementTime;
    requirement.save();
    
    return requirement;
    }