import React, { useState, useEffect } from "react";
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
import { getFormattedDate, getFormattedTime } from "@/utils/dateTimeUtils";

function AssignedTicketsPage() {
  const [view, setView] = useState(true);
  const [loading, setLoading] = useState(true);

  const {
    getAllTickets,
    allTickets: acceptedTickets,
    updateTicket,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useTicketStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    try {
      getAllTickets();
      setLoading(false);
      subscribeToMessages();

    return () => unsubscribeFromMessages();

    } catch (error) {
      console.log(error);
      setLoading(true);
    }
  }, []);

  const SubmitResolve = async (ticketId) => {
    try {
      await updateTicket({
        ticketId,
        resolvingIssue: true,
        resolvingIssueTime: Date.now(),
      });
    } catch (err) {
      console.error("Error update resolving data  fetch :", err);
    }
  };

  const handleStatusChange = (updateData) => {
    try {
      updateTicket(updateData);
      // window.location.reload();
      
    } catch (error) {
      console.log("update ticket data :", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 min-h-[calc(100vh-76px)]">
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (acceptedTickets.length === 0) {
    return (
      <div className="text-center py-10 min-h-[calc(100vh-76px)]">
        <div className="flex flex-col items-center justify-center text-center py-10 ">
          <img
            src="https://media.istockphoto.com/id/1038232966/vector/upset-magnifying-glass-vector-illustration.jpg?s=612x612&w=0&k=20&c=cHpDD-xX8wlruAOi-RsTNpaZKtBYtAjP32GpoRGKEmM="
            alt="Upset magnifying glass illustration"
            className="max-w-sm mb-6"
          />
          <p className="text-lg font-medium text-gray-600">
            No Assigned tickets to Found.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-5 py-3 min-h-[calc(100vh-76px)]">
      {/* <h1 className="text-2xl font-bold mb-4 text-center">Accepted Tickets</h1> */}
      <div className=" mx-5 pb-1">
        <div className="flex gap-5">
          <h1
            onClick={() => setView(true)}
            className={`text-2xl font-bold mb-2 p-2 cursor-pointer text-center rounded-md ${
              view ? "bg-slate-300" : ""
            }`}
          >
            Accepted Tickets
          </h1>
          <h1
            onClick={() => setView(false)}
            className={`text-2xl font-bold mb-2 p-2 cursor-pointer text-center rounded-md ${
              view ? "" : "bg-slate-300"
            }`}
          >
            Resolve Issue
          </h1>
        </div>
      </div>
      {view ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {acceptedTickets
            .filter(
              (ticket) =>
                !ticket.completedIssueByIt &&
                ticket.acceptedTicketByUserId === authUser._id
            ) // Filter out completed tickets
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
                    <p>{getFormattedDate(ticket.submissionTime)} at</p>
                    <p>{getFormattedTime(ticket.submissionTime)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                      >
                        Update Ticket Status
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] p-6 bg-white rounded-lg shadow-lg">
                      <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-semibold text-gray-800">
                          Update Ticket Status
                        </DialogTitle>
                      </DialogHeader>
                      <ul className="space-y-6">
                        {/* Start to Ticket */}
                        <li className="flex items-center justify-between">
                          <p className="font-semibold text-lg text-gray-700">
                            Initiated:{" "}
                            <span
                              className={
                                ticket.startToTicket
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {ticket.startToTicket ? "Yes" : "No"}
                            </span>
                          </p>
                          {!ticket.startToTicket && (
                            <Button
                              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                              onClick={() =>
                                handleStatusChange({
                                  ticketId: ticket._id,
                                  startToTicket: true,
                                  startWorkingOnTicketIssueTime: Date.now(),
                                })
                              }
                            >
                              Yes
                            </Button>
                          )}
                        </li>

                        {/* Reached Issue Address */}
                        <li className="flex items-center justify-between">
                          <p className="font-semibold text-lg text-gray-700">
                            Reached Issue Address:{" "}
                            <span
                              className={
                                ticket.reachIssueAddress
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {ticket.reachIssueAddress ? "Yes" : "No"}
                            </span>
                          </p>
                          {ticket.startToTicket &&
                            !ticket.reachIssueAddress && (
                              <Button
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                onClick={() =>
                                  handleStatusChange({
                                    ticketId: ticket._id,
                                    reachIssueAddress: true,
                                    reachAddressIssueTime: Date.now(),
                                  })
                                }
                              >
                                Yes
                              </Button>
                            )}
                        </li>

                        {/* Solving Issue */}
                        <li className="flex items-center justify-between">
                          <p className="font-semibold text-lg text-gray-700">
                            Solving Issue:{" "}
                            <span
                              className={
                                ticket.solvingIssue
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {ticket.solvingIssue ? "Yes" : "No"}
                            </span>
                          </p>
                          {ticket.startToTicket &&
                            ticket.reachIssueAddress &&
                            !ticket.solvingIssue && (
                              <Button
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                onClick={() =>
                                  handleStatusChange({
                                    ticketId: ticket._id,
                                    solvingIssue: true,
                                    solvingIssueTime: Date.now(),
                                  })
                                }
                              >
                                Yes
                              </Button>
                            )}
                        </li>

                        {/* Completed */}
                        <li className="flex items-center justify-between">
                          <p className="font-semibold text-lg text-gray-700">
                            Completed:{" "}
                            <span
                              className={
                                ticket.completedIssueByIt
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {ticket.completedIssueByIt ? "Yes" : "No"}
                            </span>
                          </p>
                          {ticket.startToTicket &&
                            ticket.reachIssueAddress &&
                            ticket.solvingIssue &&
                            !ticket.completedIssueByIt && (
                              <Button
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                onClick={() =>
                                  handleStatusChange({
                                    ticketId: ticket._id,
                                    completedIssueByIt: true,
                                    completedIssueByItTime: Date.now(),
                                  })
                                }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {acceptedTickets
            .filter(
              (ticket) =>
                ticket.acceptedTicketByUserId === authUser._id &&
                !ticket.completedIssue &&
                ticket.userIssueReason &&
                !ticket.resolvingIssue
            ) // Filter out completed tickets
            .map((ticket) => (
              <div className="" key={ticket._id}>
                <div className="border rounded-lg shadow-md p-4 bg-white">
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
                      <p>{getFormattedDate(ticket.submissionTime)} at</p>
                      <p>{getFormattedTime(ticket.submissionTime)}</p>
                    </div>
                  </div>
                  <div className="">
                    <p className="font-bold">-:Reason given by User:-</p>
                    <p className="text-sm px-1">
                      {ticket.userIssueReasonDetail}
                    </p>
                  </div>
                  <button
                    onClick={() => SubmitResolve(ticket._id)}
                    className="border p-2 font-bold rounded-sm mt-2 bg-blue-200 hover:bg-blue-400 hover:text-white"
                  >
                    Resolve complete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default AssignedTicketsPage;
