import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useTicketStore from "@/store/useTicketStore";
import useAuthStore from "@/store/useAuthStore";
import useRequirementStore from "@/store/useRequirementStore";
import { getFormattedDate, getFormattedTime } from "@/utils/dateTimeUtils";

function HistoryItTeamPage() {
  const [view, setView] = useState(true);
  const { getAllRequirements, allRequirements: requirements } =
    useRequirementStore();
  const { allTickets: completedTickets, getAllTickets } = useTicketStore();
  const { authUser } = useAuthStore();
  useEffect(() => {
    getAllTickets();
    getAllRequirements();
  }, [getAllTickets, getAllRequirements]);

  return (
    <div className="container mx-auto p-5 min-h-[calc(100vh-76px)]">
      <div className="flex gap-5">
        <h1
          onClick={() => setView(true)}
          className={`text-2xl font-bold mb-2 cursor-pointer p-2 text-center rounded-md ${
            view ? "bg-slate-300" : ""
          }`}
        >
          Completed Ticket History
        </h1>
        <h1
          onClick={() => setView(false)}
          className={`text-2xl font-bold mb-2 cursor-pointer p-2 text-center rounded-md ${
            view ? "" : "bg-slate-300"
          }`}
        >
          Completed Requirement History
        </h1>
      </div>
      {view ? (
        completedTickets.filter(
          (ticket) =>
            ticket.acceptedTicketByUserId && // Ensure the property exists
            ticket.acceptedTicketByUserId === authUser._id &&
            ticket.completedIssue
        ).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {completedTickets
              .filter(
                (ticket) =>
                  ticket.acceptedTicketByUserId && // Ensure the property exists
                  ticket.acceptedTicketByUserId === authUser._id &&
                  ticket.completedIssue
              )
              .map((ticket) => (
                <div
                  key={ticket._id}
                  className="border rounded-lg shadow-md p-4 bg-white"
                >
                  <h2 className="text-xl font-semibold mb-2">
                    {ticket.typeIssue}
                  </h2>

                  <div className="mb-3">
                    <img
                      src={
                        ticket.issueImage
                          ? ticket.issueImage
                          : "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"
                      }
                      alt="issue"
                      className="w-full h-40 object-cover rounded-md"
                    />
                  </div>

                  <p className="text-gray-600 mb-1">
                    Details: {ticket.issueDetail}
                  </p>
                  <p className="text-gray-600 mb-1">
                    Address: {ticket.issueAddress}
                  </p>
                  <div className="flex justify-between items-center mt-3 text-gray-600 text-sm">
                    <p className="font-bold">
                      Priority: {ticket.urgent ? "Urgent" : "Normal"}
                    </p>
                    <div className="flex gap-1 text-sm">
                      <p>{ticket.date} at</p>
                      <p>{ticket.time}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Update Ticket Status</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">
                            Update Ticket Status
                          </DialogTitle>
                        </DialogHeader>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          <li className="grid justify-between">
                            <p className="font-bold text-xl">
                              Start to Ticket:{" "}
                              {ticket.startToTicket ? "Yes" : "No"}
                            </p>
                            {!ticket.startToTicket && (
                              <Button
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                                onClick={() => (
                                  handleStatusChange(
                                    ticket.id,
                                    "startToTicket",
                                    true
                                  ),
                                  setStartWorkingOnTicketIssueTime(Date.now()),
                                  updateAcceptedTicketStatus(),
                                  updateAcceptedTicketStatus1(),
                                  assignTicket()
                                )}
                              >
                                Yes
                              </Button>
                            )}
                          </li>
                          <li className="grid justify-between">
                            <p className="font-bold text-xl">
                              Reached Issue Address:{" "}
                              {ticket.reachIssueAddress ? "Yes" : "No"}
                            </p>
                            {ticket.startToTicket &&
                              !ticket.reachIssueAddress && (
                                <Button
                                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                                  onClick={() => (
                                    handleStatusChange(
                                      ticket.id,
                                      "reachIssueAddress",
                                      true
                                    ),
                                    setReachAddressIssueTime(Date.now()),
                                    handleStatusChange(
                                      ticket.id,
                                      "startToTicket",
                                      true
                                    ),
                                    updateAcceptedTicketStatus(),
                                    updateAcceptedTicketStatus2(),
                                    assignTicket()
                                  )}
                                >
                                  Yes
                                </Button>
                              )}
                          </li>
                          <li className="grid justify-between">
                            <p className="font-bold text-xl">
                              Solving Issue:{" "}
                              {ticket.solvingIssue ? "Yes" : "No"}
                            </p>
                            {ticket.startToTicket &&
                              ticket.reachIssueAddress &&
                              !ticket.solvingIssue && (
                                <Button
                                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                                  onClick={() => (
                                    handleStatusChange(
                                      ticket.id,
                                      "solvingIssue",
                                      true
                                    ),
                                    setSolvingIssueTime(Date.now()),
                                    handleStatusChange(
                                      ticket.id,
                                      "reachIssueAddress",
                                      true
                                    ),
                                    handleStatusChange(
                                      ticket.id,
                                      "startToTicket",
                                      true
                                    ),
                                    updateAcceptedTicketStatus(),
                                    updateAcceptedTicketStatus3(),
                                    assignTicket()
                                  )}
                                >
                                  Yes
                                </Button>
                              )}
                          </li>
                          <li className="grid justify-between">
                            <p className="font-bold text-xl">
                              Completed: {ticket.completedIssue ? "Yes" : "No"}
                            </p>
                            {ticket.startToTicket &&
                              ticket.reachIssueAddress &&
                              ticket.solvingIssue &&
                              !ticket.completedIssue && (
                                <Button
                                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                                  onClick={() => (
                                    handleStatusChange(
                                      ticket.id,
                                      "completedIssue",
                                      true
                                    ),
                                    setCompletedTime(Date.now()),
                                    handleStatusChange(
                                      ticket.id,
                                      "solvingIssue",
                                      true
                                    ),
                                    handleStatusChange(
                                      ticket.id,
                                      "reachIssueAddress",
                                      true
                                    ),
                                    handleStatusChange(
                                      ticket.id,
                                      "startToTicket",
                                      true
                                    ),
                                    updateAcceptedTicketStatus(),
                                    updateAcceptedTicketStatus4(),
                                    assignTicket()
                                  )}
                                >
                                  Yes
                                </Button>
                              )}
                          </li>
                        </ul>
                      </DialogContent>
                    </Dialog>
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
              No completed issue to track.
            </p>
          </div>
        )
      ) : requirements.filter(
          (requirement) =>
            requirement.acceptedTicketByUserId && // Ensure the property exists
            requirement.acceptedTicketByUserId === authUser._id &&
            requirement.completedRequirement
        ).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {requirements
            .filter(
              (requirement) =>
                requirement.acceptedTicketByUserId && // Ensure the property exists
                requirement.acceptedTicketByUserId === authUser._id &&
                requirement.completedRequirement
            )
            .map((requirement, index) => (
              <div className="" key={`${requirement.id}-${index}`}>
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
                          {getFormattedDate(requirement.endingDate)} at {requirement.endingTime}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <h2 className="text-xl font-semibold  mb-2">Address</h2>
                        <p className="text-gray-600 mb-1">
                          {requirement.address}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <h2 className="text-xl font-semibold  mb-2">
                          Assigned At{" "}
                        </h2>
                        <p className="text-gray-600 mb-1">
                          {getFormattedDate(requirement.assignedTime)}{" "}{getFormattedTime(requirement.assignedTime)}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <h2 className="text-xl font-semibold  mb-2">
                          completed At{" "}
                        </h2>
                        <p className="text-gray-600 mb-1">
                          {getFormattedDate(requirement.completedRequirementTime)}{" "}
                          {getFormattedTime(requirement.completedRequirementTime)}
                        </p>
                      </div>
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
            No completed requirements to track.
          </p>
        </div>
      )}
    </div>
  );
}

export default HistoryItTeamPage;
