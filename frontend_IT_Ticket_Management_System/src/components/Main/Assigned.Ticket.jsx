import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  onValue,
  off,
} from "firebase/database"; // Import Firebase Realtime Database
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

const AcceptedTickets = () => {
  const [acceptedTickets, setAcceptedTickets] = useState([]);
  const [acceptedTicketId, setAcceptedTicketId] = useState("");
  const [view, setView] = useState(true);
  const [status, setStatus] = useState({
    startToTicket: false,
    reachIssueAddress: false,
    solvingIssue: false,
    completedIssue: false,
  });
  const [startWorkingOnTicketIssueTime, setStartWorkingOnTicketIssueTime] =
    useState(null);
  const [reachAddressIssueTime, setReachAddressIssueTime] = useState(null);
  const [solvingIssueTime, setSolvingIssueTime] = useState(null);
  const [completedTime, setCompletedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(); // Initialize Firebase Auth
  const user = auth.currentUser; // Get the current authenticated user
  const db = getDatabase(); // Initialize Firebase Realtime Database

  const SubmitResolve = (ticketId) => {
    try {
      const ticketRef = ref(db, `tickets/${ticketId}`);
      update(ticketRef, {
        resolvingIssue: true,
        resolvingIssueTime: Date.now(),
      });
    } catch (err) {
      console.error("Error update resolving data  fetch :", err);
    }
  };

  const assignTicket = () => {
    if (!user || !user.uid) {
      console.error("User ID is missing");
      return; // Ensure user ID is available
    }

    try {
      const acceptedTicketsRef = ref(db, `tickets`);

      // Use onValue to listen for real-time updates
      onValue(
        acceptedTicketsRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            console.log("No accepted tickets found");
            return;
          }

          const acceptedTickets = snapshot.val();

          // Convert the accepted tickets to an array and filter completed ones
          const todayCompletedTickets = Object.values(acceptedTickets);

          const completedTickets = todayCompletedTickets.filter(
            (ticket) =>
              ticket.acceptedTicketByUserId === user.uid &&
              ticket.completedIssue === true
          );

          // Update the user's record with the count of completed tickets
          update(ref(db, `users/${user.uid}`), {
            todayCompletedTickets: completedTickets.length,
          })
            .then(() => {
              // console.log("Completed Tickets:", completedTickets); // Log completed tickets
              console.log("Issue completed");
            })
            .catch((error) => {
              console.error("Error updating completed ticket count:", error);
            });
        },
        (error) => {
          console.error("Error fetching real-time ticket data:", error);
        }
      );
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  // useEffect(() => {
  //   if (!user) return; // Ensure user exists before proceeding

  //   const acceptedTicketsRef = ref(db, `tickets`);

  //   const fetchAcceptedTickets = () => {
  //     // Set up real-time listener with onValue
  //     const unsubscribe = onValue(
  //       acceptedTicketsRef,
  //       (snapshot) => {
  //         if (!snapshot.exists()) {
  //           console.log("No accepted tickets found");
  //           setAcceptedTickets([]); // Ensure state is cleared if no tickets
  //           setLoading(false);
  //           return;
  //         }

  //         // .filter((ticketData) => ticketData.acceptedTicketByUserId === user.uid)
  //         const fetchedAcceptedTickets = Object.entries(snapshot.val())
  //           .map(([id, ticketData]) => ({
  //             id,
  //             ...ticketData,
  //             date: format(new Date(ticketData.assignedTime), "dd/MM/yyyy"),
  //             time: format(new Date(ticketData.assignedTime), "HH:mm:ss"),
  //           }));
  // // console.log(user.uid)
  // console.log(fetchedAcceptedTickets)
  //         // setAcceptedTickets(fetchedAcceptedTickets);
  //         setLoading(false);
  //       },
  //       (error) => {
  //         console.error("Error fetching accepted tickets: ", error);
  //         setLoading(false);
  //       }
  //     );

  //     return unsubscribe;
  //   };

  //   const unsubscribe = fetchAcceptedTickets();

  //   // Cleanup function to remove the listener when the component unmounts
  //   return () => {
  //     if (unsubscribe) {
  //       unsubscribe(); // Call the unsubscribe function returned by onValue
  //     }
  //   };
  // }, [user]);

  useEffect(() => {
    if (!user) return; // Ensure user exists before proceeding

    const acceptedTicketsRef = ref(db, `tickets`);

    const fetchAcceptedTickets = () => {
      try {
        // Set up real-time listener with onValue
        onValue(
          acceptedTicketsRef,
          (snapshot) => {
            if (!snapshot.exists()) {
              console.log("No accepted tickets found");
              setLoading(false);
              return;
            }

            const fetchedAcceptedTickets = Object.entries(snapshot.val())
              .filter(
                ([_, ticketData]) =>
                  ticketData?.acceptedTicketByUserId === user.uid
              )
              .map(([id, ticketData]) => ({
                id,
                ...ticketData,
                date: format(new Date(ticketData.assignedAt), "dd/MM/yyyy"),
                time: format(new Date(ticketData.assignedAt), "HH:mm:ss"),
              }));
            // console.log(fetchedAcceptedTickets);

            setAcceptedTickets(fetchedAcceptedTickets);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching accepted tickets: ", error);
            setLoading(false);
          }
        );
      } catch (error) {
        console.error("Error fetching accepted tickets: ", error);
        setLoading(false);
      }
    };

    // Call the fetch function to set up the listener
    fetchAcceptedTickets();

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      off(acceptedTicketsRef); // Stop listening for changes
    };
  }, [user]); // Dependency on the user

  const updateAcceptedTicketStatus = async () => {
    if (!user || !acceptedTicketId) return;

    try {
      // const updateStatusRef = ref(
      //   db,
      //   `users/${user.uid}/acceptedTickets/${acceptedTicketId}`
      // );
      const updateTicketRef = ref(db, `tickets/${acceptedTicketId}`);

      const updateFields = {
        ...status,
      };

      // await update(updateStatusRef, updateFields);
      await update(updateTicketRef, updateFields);

      console.log("Ticket status updated successfully.");
      // window.location.reload();
    } catch (error) {
      console.error("Error updating ticket status: ", error);
    }
  };

  const updateAcceptedTicketStatus1 = async () => {
    if (!user || !acceptedTicketId) return;

    try {
      // const updateStatusRef = ref(
      //   db,
      //   `users/${user.uid}/acceptedTickets/${acceptedTicketId}`
      // );
      const updateTicketRef = ref(db, `tickets/${acceptedTicketId}`);

      // await update(updateStatusRef, { startWorkingOnTicketIssueTime });
      await update(updateTicketRef, { startWorkingOnTicketIssueTime });
      console.log("Ticket status updated successfully.");
      // window.location.reload();
    } catch (error) {
      console.error("Error updating ticket status: ", error);
    }
  };
  const updateAcceptedTicketStatus2 = async () => {
    if (!user || !acceptedTicketId) return;

    try {
      // const updateStatusRef = ref(
      //   db,
      //   `users/${user.uid}/acceptedTickets/${acceptedTicketId}`
      // );
      const updateTicketRef = ref(db, `tickets/${acceptedTicketId}`);

      // await update(updateStatusRef, { reachAddressIssueTime });
      await update(updateTicketRef, { reachAddressIssueTime });
      console.log("Ticket status updated successfully.");
      // window.location.reload();
    } catch (error) {
      console.error("Error updating ticket status: ", error);
    }
  };
  const updateAcceptedTicketStatus3 = async () => {
    if (!user || !acceptedTicketId) return;

    try {
      // const updateStatusRef = ref(
      //   db,
      //   `users/${user.uid}/acceptedTickets/${acceptedTicketId}`
      // );
      const updateTicketRef = ref(db, `tickets/${acceptedTicketId}`);

      // await update(updateStatusRef, { solvingIssueTime });
      await update(updateTicketRef, { solvingIssueTime });
      console.log("Ticket status updated successfully.");
      // window.location.reload();
    } catch (error) {
      console.error("Error updating ticket status: ", error);
    }
  };
  const updateAcceptedTicketStatus4 = async () => {
    if (!user || !acceptedTicketId) return;

    try {
      // const updateStatusRef = ref(
      //   db,
      //   `users/${user.uid}/acceptedTickets/${acceptedTicketId}`
      // );
      const updateTicketRef = ref(db, `tickets/${acceptedTicketId}`);

      // await update(updateStatusRef, { completedTime });
      await update(updateTicketRef, { completedIssueByItTime: completedTime });
      console.log("Ticket status updated successfully.");
      // window.location.reload();
    } catch (error) {
      console.error("Error updating ticket status: ", error);
    }
  };

  const handleStatusChange = (ticketId, field, value) => {
    setAcceptedTicketId(ticketId); // Set the ticket ID
    setStatus((prevStatus) => ({
      ...prevStatus,
      [field]: value,
    }));
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
            .filter((ticket) => !ticket.completedIssueByIt) // Filter out completed tickets
            .map((ticket) => (
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
                            Start to Ticket:{" "}
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
                                onClick={() => (
                                  handleStatusChange(
                                    ticket.id,
                                    "completedIssueByIt",
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

                  {/* <Dialog>
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
                          Start to Ticket: {ticket.startToTicket ? "Yes" : "No"}
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
                        {ticket.startToTicket && !ticket.reachIssueAddress && (
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
                          Completed: {ticket.completedIssueByIt ? "Yes" : "No"}
                        </p>
                        {ticket.startToTicket &&
                          ticket.reachIssueAddress &&
                          ticket.solvingIssue &&
                          !ticket.completedIssueByIt && (
                            <Button
                              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                              onClick={() => (
                                handleStatusChange(
                                  ticket.id,
                                  "completedIssueByIt",
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
                </Dialog> */}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {acceptedTickets
            .filter(
              (ticket) => !ticket.completedIssue && ticket.userIssueReason && !ticket.resolvingIssue
            ) // Filter out completed tickets
            .map((ticket) => (
              <div className="">
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
                  <div className="">
                    <p className="font-bold">-:Reason given by User:-</p>
                    <p className="text-sm px-1">
                      {ticket.userIssueReasonDetail}
                    </p>
                  </div>
                  <button
                    onClick={() => SubmitResolve(ticket.ticketId)}
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
};

export default AcceptedTickets;
