import useRequirementStore from "@/store/useRequirementStore";
import { getFormattedDate, getFormattedTime } from "@/utils/dateTimeUtils";
import React, { useEffect } from "react";

function RequirementComponent({ data }) {
  const { getUserRequirements, userRequirements } = useRequirementStore();

  useEffect(() => {
    try {
      getUserRequirements();
    } catch (error) {
      console.log(error);
    }
  }, [getUserRequirements]);

  const requirements = data
    ? userRequirements.filter((requirement) => requirement.completedRequirement)
    : userRequirements.filter((requirement) => !requirement.completedRequirement);

  return (
    <div className="m-5">
      {requirements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {requirements.map((requirement, index) => (
            <div className="" key={`${requirement._id}`}>
              <div className="border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between">
                <div className="">
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
                      <h2 className="text-xl font-semibold  mb-2">
                        Address :{" "}
                      </h2>
                      <p className="text-gray-600 mb-1">
                        {requirement.address}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <h2 className="text-xl font-semibold  mb-2">
                        Assigned {" :"}
                      </h2>
                      <p className="text-gray-600 mb-1">
                        {requirement.assigned ? (
                          <span className="text-green-400 font-bold">Yes</span>
                        ) : (
                          <span className="text-red-400 font-bold">No</span>
                        )}
                      </p>
                    </div>

                    {requirement.assignedTime && (
                      <div className="flex gap-2 items-center">
                        <h2 className="text-xl font-semibold  mb-2">
                          Assigned At{" :"}
                        </h2>
                        <p className="text-gray-600 mb-1">
                          {getFormattedDate(requirement.assignedTime)}{" "}
                          {getFormattedTime(requirement.assignedTime)}
                        </p>
                      </div>
                    )}

                    {data && (
                      <div className="flex gap-2 items-center">
                        <h2 className="text-xl font-semibold  mb-2">
                          completed At{" "}
                        </h2>
                        <p className="text-gray-600 mb-1">
                        {getFormattedDate(requirement.completedRequirementTime)}{" "}
                        {getFormattedTime(requirement.completedRequirementTime)}
                        
                        </p>
                      </div>
                    )}
                  </div>
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
            No requirements to track.
          </p>
        </div>
      )}
    </div>
  );
}

export default RequirementComponent;
