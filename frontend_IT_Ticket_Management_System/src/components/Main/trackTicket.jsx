import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { ref, get, onValue } from "firebase/database";
import { db } from "../config/firebaseConfig"; // Assuming you already have db initialized
import { format } from "date-fns";
import TrackTicketView from "./TrackTicketView";

const TrackTicket = () => {
  const [ticketIds, setTicketIds] = useState([]); // Initialize as an array
  const [ticketTracking, setTicketTracking] = useState([]); // Store tracking info here
  const [tractView, setTrackView] = useState(true);
  const [ticketIndex, setTicketIndex] = useState(null);
  const [view, setView] = useState(true);
  const [requirements, setRequirements] = useState([]);
  // const [selectedTicket, setSelectedTicket] = useState(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // console.log(requirements);
  // console.log(currentUser.uid);

  const fetchTickets = async () => {
    try {
      const requirementsRef = ref(db, "requirement");
      const snapshotrequirements = await get(requirementsRef);

      if (snapshotrequirements.exists()) {
        const fetchedTickets = [];
        snapshotrequirements.forEach((doc) => {
          const requirementsData = doc.val();

          if (requirementsData.userId === currentUser.uid) {
            fetchedTickets.push({
              id: doc.key, // Use key for ticket ID
              ...requirementsData,
              ...(requirementsData.assignedAt
                ? {
                    assignedDate: format(
                      new Date(requirementsData.assignedAt),
                      "dd/MM/yyyy"
                    ),
                    assignedTime: format(
                      new Date(requirementsData.assignedAt),
                      "HH:mm:ss"
                    ),
                  }
                : {}),
            });
          }
        });
        // console.log(fetchedTickets);
        setRequirements(fetchedTickets);
      }

      // setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets: ", error);
      setError("Failed to fetch tickets.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, []);

  // First useEffect to fetch ticketIds
  useEffect(() => {
    const fetchTicketData = async () => {
      if (!currentUser) return;

      try {
        const ticketRef = ref(db, `users/${currentUser.uid}/ticketIds`);
        const snapshot = await get(ticketRef);
        const userTicketIds = snapshot.val();

        // Assuming userTicketIds is an object or array, process accordingly
        if (userTicketIds && Array.isArray(userTicketIds)) {
          setTicketIds(userTicketIds); // If it's already an array
        } else if (userTicketIds && typeof userTicketIds === "object") {
          setTicketIds(Object.values(userTicketIds)); // Convert object to array
        } else {
          setTicketIds([]); // Default to empty array
        }
      } catch (error) {
        console.error("Fetching ticket data error:", error);
        setTicketIds([]); // Handle error and set default empty array
      }
    };

    fetchTicketData();
  }, [currentUser]);

  useEffect(() => {
    const fetchTicketTrackingData = async () => {
      try {
        const trackingData = []; // Temporary storage for ticket data
        const listeners = []; // Track listeners for cleanup

        if (Array.isArray(ticketIds) && ticketIds.length > 0) {
          for (const id of ticketIds) {
            const ticketRef = ref(db, `tickets/${id.userRaisedTicketId}`);

            const listener = onValue(ticketRef, (snapshot) => {
              const ticketInfo = snapshot.val();

              if (ticketInfo) {
                // Format ticket data with date and time
                const formattedTicket = {
                  id,
                  ...ticketInfo,
                  date: format(
                    new Date(ticketInfo.submissionTime),
                    "dd/MM/yyyy"
                  ),
                  time: format(new Date(ticketInfo.submissionTime), "HH:mm:ss"),
                };

                // Check if ticket already exists in trackingData
                const existingIndex = trackingData.findIndex(
                  (ticket) =>
                    ticket.submissionTime === formattedTicket.submissionTime
                );

                if (existingIndex !== -1) {
                  trackingData[existingIndex] = formattedTicket;
                } else {
                  trackingData.push(formattedTicket);
                }

                // Update state if trackingData has changed
                setTicketTracking((prevData) => {
                  if (
                    prevData.length !== trackingData.length ||
                    JSON.stringify(prevData) !== JSON.stringify(trackingData)
                  ) {
                    return [...trackingData];
                  }
                  return prevData;
                });
              } else {
                console.warn(
                  `No data found for ticket ID: ${id.userRaisedTicketId}`
                );
              }
            });

            listeners.push({ ticketRef, listener });
          }

          // Cleanup listeners when component unmounts
          return () => {
            listeners.forEach(({ ticketRef, listener }) => {
              off(ticketRef, listener);
            });
            console.log("Cleaned up Firebase listeners.");
          };
        } else {
          console.warn("No valid ticketIds provided.");
        }
      } catch (error) {
        console.error("Error fetching ticket tracking data:", error);
      }
    };

    if (Array.isArray(ticketIds) && ticketIds.length > 0) {
      fetchTicketTrackingData();
    }
  }, [ticketIds]);

  // const handleToggleView = (ticketId) => {
  //   setViewTicketId((prevTicketId) =>
  //     prevTicketId === ticketId ? null : ticketId
  //   );
  // };

  return (
    <div className="min-h-[calc(100vh-76px)]">
      {tractView && (
        <div className="mt-5 mx-5">
          <div className="flex gap-5">
            <h1
              onClick={() => setView(true)}
              className={`text-2xl font-bold mb-2 p-2 cursor-pointer text-center rounded-md ${
                view ? "bg-slate-300" : ""
              }`}
            >
              All Tickets
            </h1>
            <h1
              onClick={() => setView(false)}
              className={`text-2xl font-bold mb-2 p-2 cursor-pointer text-center rounded-md ${
                view ? "" : "bg-slate-300"
              }`}
            >
              All Requirements
            </h1>
          </div>
        </div>
      )}
      {view ? (
        <div className="">
          {ticketTracking.length > 0 ? (
            tractView ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-5">
                {ticketTracking.map(
                  (ticket, index) =>
                    !ticket.completedIssue && (
                      <div key={index}>
                        <div
                          key={index}
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
                          <div className="mt-4 text-left">
                            <button
                              onClick={() => {
                                if (ticketIndex !== index) {
                                  // Update index only if it differs from the current index
                                  setTicketIndex(index);
                                  setTrackView(false);
                                }
                              }}
                              className="border p-2 rounded-sm bg-blue-100"
                            >
                              View Live Track Ticket
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            ) : (
              <div className="">
                <div className="bg-slate-300 px-2 py-1">
                  <button
                    className="text-lg"
                    onClick={() => (setTicketIndex(null), setTrackView(true))}
                  >
                    <i className="fa-solid fa-arrow-left"></i> back
                  </button>
                </div>
                <TrackTicketView
                  ticket={ticketTracking[ticketIndex]}
                  confirmationView={true}
                />
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10 ">
              <img
                src="https://media.istockphoto.com/id/1038232966/vector/upset-magnifying-glass-vector-illustration.jpg?s=612x612&w=0&k=20&c=cHpDD-xX8wlruAOi-RsTNpaZKtBYtAjP32GpoRGKEmM="
                alt="Upset magnifying glass illustration"
                className="max-w-sm mb-6"
              />
              <p className="text-lg font-medium text-gray-600">
                No issue to track.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="m-5">
          {requirements.length > 0 ? (
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
                            {requirement.startingDate} at{" "}
                            {requirement.startingTime}
                          </p>
                        </div>
                        <div className="">
                          <h2 className="text-xl font-semibold mb-2">
                            Form :-
                          </h2>
                          <p className="text-gray-600 mb-1">
                            {requirement.endingDate} at {requirement.endingTime}
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
                            {requirement.assignedDate ? (
                              <span className="text-green-400 font-bold">
                                Yes
                              </span>
                            ) : (
                              <span className="text-red-400 font-bold">No</span>
                            )}
                          </p>
                        </div>

                        {requirement.assignedDate && (
                          <div className="flex gap-2 items-center">
                            <h2 className="text-xl font-semibold  mb-2">
                              Assigned At{" :"}
                            </h2>
                            <p className="text-gray-600 mb-1">
                              {requirement.assignedDate}{" "}
                              {requirement.assignedTime}
                            </p>
                          </div>
                        )}
                        {/* <div className="flex gap-2 items-center">
                        <h2 className="text-xl font-semibold  mb-2">
                          completed At{" "}
                        </h2>
                        <p className="text-gray-600 mb-1">
                          {requirement.completedDate}{" "}
                          {requirement.completedTime}
                        </p>
                      </div> */}
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
      )}
    </div>
  );
};

export default TrackTicket;
