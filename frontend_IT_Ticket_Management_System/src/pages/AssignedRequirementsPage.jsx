import useAuthStore from "@/store/useAuthStore";
import useRequirementStore from "@/store/useRequirementStore";
import { getFormattedDate } from "@/utils/dateTimeUtils";
import React, { useState, useEffect } from "react";

function AssignedRequirementsPage() {
  //  const [requirements, setRequirements] = useState([]);

  const {
    allRequirements: requirements,
    getAllRequirements,
    updateRequirement,
  } = useRequirementStore();
  const { authUser } = useAuthStore();
  useEffect(() => {
    getAllRequirements();
  }, [getAllRequirements]);

  // console.log(requirements);

  const handleAssignCompleted = async (requirement) => {
    try {
      await updateRequirement({
        requirementId:requirement._id,
        completedRequirement: true,
        completedRequirementTime: Date.now(),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error assigning ticket: ", error);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="text-center py-10 min-h-[calc(100vh-76px)]">
  //       <div className="flex justify-center items-center h-screen bg-gray-50">
  //         <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="container mx-auto  p-5 min-h-[calc(100vh-76px)]">
      <h1 className={`text-2xl font-bold mb-2 p-2 text-center rounded-md `}>
        Assigned Requirement List
      </h1>
      {requirements.filter(
        (requirement) =>
          requirement.acceptedTicketByUserId && // Ensure the property exists
          requirement.acceptedTicketByUserId === authUser._id &&
          !requirement.completedRequirement
      ).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {requirements
            .filter(
              (requirement) =>
                requirement.acceptedTicketByUserId && // Ensure the property exists
                requirement.acceptedTicketByUserId === authUser._id &&
                !requirement.completedRequirement
            )
            .map((requirement) => (
              <div className="" key={`${requirement._id}`}>
                <div className="border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between">
                  <div className="">
                    <div className="">
                      <h2 className="text-xl font-semibold mb-2">
                        components :-
                      </h2>
                      {requirement.components.map((component, index) => (
                        <p className="text-gray-600 mb-1" key={index}>
                          {index + 1}. {component}
                        </p>
                      ))}
                    </div>
                    <div className="">
                      <h2 className="text-xl font-semibold mb-2">To :-</h2>
                      <p className="text-gray-600 mb-1">
                        {getFormattedDate(requirement.startingDate)} at{" "}
                        {requirement.startingTime}
                      </p>
                    </div>
                    <div className="">
                      <h2 className="text-xl font-semibold mb-2">Form :-</h2>
                      <p className="text-gray-600 mb-1">
                        {getFormattedDate(requirement.endingDate)} at{" "}
                        {requirement.endingTime}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <h2 className="text-xl font-semibold  mb-2">Address</h2>
                      <p className="text-gray-600 mb-1">
                        {requirement.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex  justify-center mt-4 h-11 ">
                    <button
                      type="button" // Prevent default form submission
                      className="border p-2 font-bold shadow-md rounded-sm bg-gray-400 hover:bg-gray-500 transition-all w-full text-center "
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default behavior
                        handleAssignCompleted(requirement); // Call your function
                      }}
                    >
                      Requirement Completed
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-10 ">
          <img
            src="https://media.istockphoto.com/id/1038232966/vector/upset-magnifying-glass-vector-illustration.jpg?s=612x612&w=0&k=20&c=cHpDD-xX8wlruAOi-RsTNpaZKtBYtAjP32GpoRGKEmM="
            alt="Upset magnifying glass illustration"
            className="max-w-sm mb-6"
          />
          <p className="text-lg font-medium text-gray-600">
            No Assigned requirements found.
          </p>
        </div>
      )}
    </div>
  );
}

export default AssignedRequirementsPage;
