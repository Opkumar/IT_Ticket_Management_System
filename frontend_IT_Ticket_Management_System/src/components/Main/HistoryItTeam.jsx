import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, set, update } from "firebase/database"; // Import Firebase Realtime Database
import { getAuth } from "firebase/auth"; // Import Firebase Auth for user information
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const HostoryItTeam = () => {
  const [acceptedTickets, setAcceptedTickets] = useState([]);
  const [acceptedTicketId, setAcceptedTicketId] = useState("");
  const [ticketStatus, setTicketStatus] = useState({});
  const [status, setStatus] = useState({
    startToTicket: false,
    reachIssueAddress: false,
    solvingIssue: false,
    completedIssue: false,
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(true);
  const [requirements, setRequirements] = useState([]);
  const auth = getAuth(); // Initialize Firebase Auth
  const user = auth.currentUser; // Get the current authenticated user
  const db = getDatabase(); // Initialize Firebase Realtime Database

  const fetchTickets = async () => {
    try {
      const requirementsRef = ref(db, "requirement");
      const snapshotrequirements = await get(requirementsRef);
      if (snapshotrequirements.exists()) {
        const fetchedTickets = [];
        snapshotrequirements.forEach((doc) => {
          const requirementsData = doc.val();
          if (
            requirementsData.acceptedTicketByUserId === user.uid &&
            requirementsData.completedRequirement
          ) {
            fetchedTickets.push({
              id: doc.key, // Use key for ticket ID
              ...requirementsData,
              assignedDate: format(requirementsData.assignedAt, "dd/MM/yyyy"),
              assignedTime: format(requirementsData.assignedAt, "HH:mm:ss"),
              completedDate: format(
                requirementsData.completedRequirementTime,
                "dd/MM/yyyy"
              ),
              completedTime: format(
                requirementsData.completedRequirementTime,
                "HH:mm:ss"
              ),
            });
          }
        });
        setRequirements(fetchedTickets);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets: ", error);
      setError("Failed to fetch tickets.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, []);
  const assignTicket = async () => {
    if (!user || !user.uid) {
      console.error("User ID is missing");
      return; // Ensure user ID is available
    }

    try {
      const acceptedTicketsRef = ref(db, `tickets`);
      const snapshot = await get(acceptedTicketsRef);

      if (!snapshot.exists()) {
        console.log("No accepted tickets found");
        return;
      }

      const acceptedTickets = snapshot.val();
      const completedTickets = Object.values(acceptedTickets).filter(
        (ticket) =>
          ticket.acceptedTicketByUserId === user.uid &&
          ticket.completedIssue === true
      );

      // Update the user's record with the count of completed tickets
      await update(ref(db, `users/${user.uid}`), {
        todayCompletedTickets: completedTickets.length,
      });

      console.log("Completed Tickets:", completedTickets); // Log completed tickets
      console.log("Issue completed");
    } catch (error) {
      console.error("Error completing ticket: ", error);
    }
  };

  const fetchAcceptedTickets = async () => {
    if (!user) return;
    try {
      const acceptedTicketsRef = ref(db, `tickets`);
      const snapshot = await get(acceptedTicketsRef);

      if (!snapshot.exists()) {
        console.log("No accepted tickets found");
        setLoading(false);
        return;
      }

      const fetchedAcceptedTickets = Object.entries(snapshot.val())
        .filter(
          ([_, ticketData]) => ticketData?.acceptedTicketByUserId === user.uid
        )
        .map(([id, ticketData]) => ({
          id,
          ...ticketData,
          date: format(new Date(ticketData.assignedAt), "dd/MM/yyyy"),
          time: format(new Date(ticketData.assignedAt), "HH:mm:ss"),
        }));

      setAcceptedTickets(fetchedAcceptedTickets);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accepted tickets: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedTickets();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-10 min-h-[calc(100vh-76px)]">
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Filter only completed tickets for rendering
  const completedTickets = acceptedTickets.filter(
    (ticket) => ticket.completedIssue === true
  );

  // if (completedTickets.length === 0) {
  //   return (
  //     <div className="flex flex-col items-center justify-center text-center py-10 min-h-[calc(100vh-76px)]">
  //       <img
  //         src="https://media.istockphoto.com/id/1038232966/vector/upset-magnifying-glass-vector-illustration.jpg?s=612x612&w=0&k=20&c=cHpDD-xX8wlruAOi-RsTNpaZKtBYtAjP32GpoRGKEmM="
  //         alt="Upset magnifying glass illustration"
  //         className="max-w-sm mb-6"
  //       />
  //       <p className="text-lg font-medium text-gray-600">
  //         No completed tickets found.
  //       </p>
  //     </div>
  //   );
  // }

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
        completedTickets > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {completedTickets.map((ticket) => (
              <div
                key={ticket.id}
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
                            Solving Issue: {ticket.solvingIssue ? "Yes" : "No"}
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
                  {/* <button
                onClick={() =>
                  setTicketStatus((prevStatus) => ({
                    ...prevStatus,
                    [ticket.id]: !prevStatus[ticket.id], // Toggle the status for this specific ticket
                  }))
                }
                className="font-bold text-2xl"
              >
                Ticket Status
              </button>

              {ticketStatus[ticket.id] && (
                <ul className="list-disc list-inside text-sm text-gray-600">
                  <li className="grid justify-between">
                    <p className="font-bold text-xl">
                      Start to Ticket: {ticket.startToTicket ? "Yes" : "No"}
                    </p>
                    {!ticket.startToTicket && (
                      <button
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                        onClick={() => (
                          handleStatusChange(ticket.id, "startToTicket", true),
                          setStartWorkingOnTicketIssueTime(Date.now()),
                          updateAcceptedTicketStatus(),
                          updateAcceptedTicketStatus1(),
                          assignTicket()
                        )}
                      >
                        Yes
                      </button>
                    )}
                  </li>
                  <li className="grid justify-between">
                    <p className="font-bold text-xl">
                      Reached Issue Address:{" "}
                      {ticket.reachIssueAddress ? "Yes" : "No"}
                    </p>
                    {ticket.startToTicket && !ticket.reachIssueAddress && (
                      <button
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                        onClick={() => (
                          handleStatusChange(
                            ticket.id,
                            "reachIssueAddress",
                            true
                          ),
                          setReachAddressIssueTime(Date.now()),
                          handleStatusChange(ticket.id, "startToTicket", true),
                          updateAcceptedTicketStatus(),
                          updateAcceptedTicketStatus2(),
                          assignTicket()
                        )}
                      >
                        Yes
                      </button>
                    )}
                  </li>
                  <li className="grid justify-between">
                    <p className="font-bold text-xl">
                      Solving Issue: {ticket.solvingIssue ? "Yes" : "No"}
                    </p>
                    {ticket.startToTicket &&
                      ticket.reachIssueAddress &&
                      !ticket.solvingIssue && (
                        <button
                          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                          onClick={() => (
                            handleStatusChange(ticket.id, "solvingIssue", true),
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
                        </button>
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
                        <button
                          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                          onClick={() => (
                            handleStatusChange(
                              ticket.id,
                              "completedIssue",
                              true
                            ),
                            setCompletedTime(Date.now()),
                            handleStatusChange(ticket.id, "solvingIssue", true),
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
                        </button>
                      )}
                  </li>
                </ul>
              )} */}
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
      ) : requirements > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {requirements.map((requirement, index) => (
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
                        {requirement.startingDate} at {requirement.startingTime}
                      </p>
                    </div>
                    <div className="">
                      <h2 className="text-xl font-semibold mb-2">Form :-</h2>
                      <p className="text-gray-600 mb-1">
                        {requirement.endingDate} at {requirement.endingTime}
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
                        {requirement.assignedDate} {requirement.assignedTime}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <h2 className="text-xl font-semibold  mb-2">
                        completed At{" "}
                      </h2>
                      <p className="text-gray-600 mb-1">
                        {requirement.completedDate} {requirement.completedTime}
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
};

export default HostoryItTeam;
