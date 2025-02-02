import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, update, get } from "firebase/database"; // Import Realtime Database functions
import { getAuth } from "firebase/auth";
import { format } from "date-fns";

const ITteam = () => {
  const [tickets, setTickets] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();
  // console.log(requirements);

  const fetchTickets = async () => {
    try {
      const ticketsRef = ref(db, "tickets");
      const requirementsRef = ref(db, "requirement");
      const snapshot = await get(ticketsRef);
      const snapshotrequirements = await get(requirementsRef);
      if (snapshotrequirements.exists()) {
        // const data = snapshotrequirements.val();
        // setRequirements(Object.values(data));
        const fetchedTickets = [];
        snapshotrequirements.forEach((doc) => {
          const requirementsData = doc.val();
          if (!requirementsData.assigned) {
            fetchedTickets.push({
              id: doc.key, // Use key for ticket ID
              ...requirementsData,
            });
          }
        });
        setRequirements(fetchedTickets);
      }
      if (snapshot.exists()) {
        const fetchedTickets = [];
        snapshot.forEach((doc) => {
          const ticketData = doc.val();
          if (!ticketData.assigned) {
            fetchedTickets.push({
              id: doc.key, // Use key for ticket ID
              ...ticketData,
              date: format(ticketData.submissionTime, "dd/MM/yyyy"),
              time: format(ticketData.submissionTime, "HH:mm:ss"),
            });
          }
        });
        setTickets(fetchedTickets);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets: ", error);
      setError("Failed to fetch tickets.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAcceptedTickets = async () => {
      if (!user) {
        console.error("No authenticated user found!");
        return;
      }
      try {
        const acceptedTicketsRef = ref(db, `users/${user.uid}/acceptedTickets`);
        const today = format(new Date(), "dd/MM/yyyy");
        const snapshot = await get(acceptedTicketsRef);

        if (snapshot.exists()) {
          let todayAcceptedTickets = 0;
          let todayCompletedTickets = 0;

          snapshot.forEach((doc) => {
            const ticketData = doc.val();
            const ticketDate = format(ticketData.assignedTime, "dd/MM/yyyy");

            if (ticketData.completedIssue === false && ticketDate === today) {
              todayAcceptedTickets++;
            }
            if (ticketData.completedIssue === true && ticketDate === today) {
              todayCompletedTickets++;
            }
          });

          // Increment acceptedTicketNumber instead of replacing it
          await update(ref(db, `users/${user.uid}`), {
            todayAcceptedTickets: todayAcceptedTickets,
            todayCompletedTickets: todayCompletedTickets,
          });
        }
      } catch (error) {
        console.error("Error fetching accepted tickets: ", error);
      }
    };

    fetchAcceptedTickets();
  }, [user]); // Run this effect when user changes

  const handleAssignToMe = async (ticket) => {
    if (!user) {
      console.error("No authenticated user found!");
      return;
    }

    try {
      const ticketRef = ref(db, `tickets/${ticket.id}`);
      // const assignedUserRef = ref(
      //   db,
      //   `users/${user.uid}/acceptedTickets/${ticket.id}`
      // );

      // await set(assignedUserRef, {
      //   ticketId: ticket.id,
      //   typeIssue: ticket.typeIssue,
      //   issueImage: ticket.issueImage,
      //   issueDetail: ticket.issueDetail,
      //   issueAddress: ticket.issueAddress,
      //   urgent: ticket.urgent,
      //   submissionTime: ticket.submissionTime,
      //   assignedTime: Date.now(), // Use current time for assigned time
      //   startWorkingOnTicketIssueTime: null,
      //   reachAddressIssueTime: null,
      //   solvingIssueTime: null,
      //   completedTime: null,
      //   assigned: true,
      //   startToTicket: false,
      //   reachIssueAddress: false,
      //   solvingIssue: false,
      //   completedIssue: false,
      // });

      await update(ticketRef, {
        acceptedTicketByUserId: user.uid,
        assigned: true,
        assignedAt: new Date().toISOString(), // Store as ISO string
      });

      console.log(`Ticket ${ticket.id} successfully assigned to ${user.email}`);
      window.location.reload();
    } catch (error) {
      console.error("Error assigning ticket: ", error);
      setError("Failed to assign ticket.");
    }
  };
  const handleAssignToMe2 = async (requirement) => {
    if (!user) {
      console.error("No authenticated user found!");
      return;
    }
    // console.log(requirement);

    try {
      const requirementsRef = ref(db, `requirement/${requirement.id}`);

      await update(requirementsRef, {
        acceptedTicketByUserId: user.uid,
        assigned: true,
        assignedAt: new Date().toISOString(), // Store as ISO string
      });

      window.location.reload();
    } catch (error) {
      console.error("Error assigning ticket: ", error);
      setError("Failed to assign ticket.");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 min-h-[calc(100vh-76px)]">
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-10 min-h-[calc(100vh-76px)]">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto  p-5 min-h-[calc(100vh-76px)]">
      <div className="flex gap-5">
        <h1
          onClick={() => setView(true)}
          className={`text-2xl font-bold mb-2 p-2 text-center rounded-md ${
            view ? "bg-slate-300" : ""
          }`}
        >
          Ticket List
        </h1>
        <h1
          onClick={() => setView(false)}
          className={`text-2xl font-bold mb-2 p-2 text-center rounded-md ${
            view ? "" : "bg-slate-300"
          }`}
        >
          Requirement List
        </h1>
      </div>
      <div className="">
        {view ? (
          tickets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between"
                >
                  <div className="">
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
                        Priority:{" "}
                        {ticket.urgent ? (
                          <span className="text-red-400">Urgent</span>
                        ) : (
                          <span className="text-green-400">Normal</span>
                        )}
                      </p>
                      <div className="flex gap-1 text-sm">
                        <p>{ticket.date} at</p>
                        <p>{ticket.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex  justify-center mt-4 h-11 ">
                    <button
                      type="button" // Prevent default form submission
                      className="border p-2 font-bold shadow-md rounded-sm bg-gray-400 hover:bg-gray-500 transition-all w-full text-center "
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default behavior
                        handleAssignToMe(ticket); // Call your function
                      }}
                    >
                      Assign To Me
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10 min-h-[calc(100vh-76px)]">
              <img
                src="https://media.istockphoto.com/id/1038232966/vector/upset-magnifying-glass-vector-illustration.jpg?s=612x612&w=0&k=20&c=cHpDD-xX8wlruAOi-RsTNpaZKtBYtAjP32GpoRGKEmM="
                alt="Upset magnifying glass illustration"
                className="max-w-sm mb-6"
              />
              <p className="text-lg font-medium text-gray-600">
                No issue found.
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
                          <p className="text-gray-600 mb-1">
                            {index + 1}. {component}
                          </p>
                        ))}
                      </div>
                      <div className="">
                        <h2 className="text-xl font-semibold mb-2">To :-</h2>
                        <p className="text-gray-600 mb-1">
                          {requirement.startingDate} at{" "}
                          {requirement.startingTime}
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
                    </div>
                    <div className="flex  justify-center mt-4 h-11 ">
                      <button
                        type="button" // Prevent default form submission
                        className="border p-2 font-bold shadow-md rounded-sm bg-gray-400 hover:bg-gray-500 transition-all w-full text-center "
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default behavior
                          handleAssignToMe2(requirement); // Call your function
                        }}
                      >
                        Assign To Me
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10 min-h-[calc(100vh-76px)]">
            <img
              src="https://media.istockphoto.com/id/1038232966/vector/upset-magnifying-glass-vector-illustration.jpg?s=612x612&w=0&k=20&c=cHpDD-xX8wlruAOi-RsTNpaZKtBYtAjP32GpoRGKEmM="
              alt="Upset magnifying glass illustration"
              className="max-w-sm mb-6"
            />
            <p className="text-lg font-medium text-gray-600">
              No requirements found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ITteam;
