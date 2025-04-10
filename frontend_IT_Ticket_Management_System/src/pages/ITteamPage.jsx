import React, { useState, useEffect } from "react";
import useTicketStore from "@/store/useTicketStore";
import useRequirementStore from "@/store/useRequirementStore";
import { getFormattedDate, getFormattedTime } from "@/utils/dateTimeUtils";
import useAuthStore from "@/store/useAuthStore";

function ITteamPage() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(true);

  const { authUser } = useAuthStore();
  const { getAllTickets, allTickets: tickets, updateTicket,subscribeToMessages,
    unsubscribeFromMessages, } = useTicketStore();
  const {
    allRequirements: requirements,
    getAllRequirements,
    updateRequirement,
  } = useRequirementStore();

  useEffect(() => {
    try {
      getAllTickets();
      getAllRequirements();
      setLoading(false);
      subscribeToMessages();

    return () => unsubscribeFromMessages();
    } catch (error) {
      console.log(error);
      setLoading(true);
    }
  }, [getAllTickets, getAllRequirements]);

  useEffect(() => {
    const fetchAcceptedTickets = async () => {
      //   if (!user) {
      //     console.error("No authenticated user found!");
      //     return;
      //   }
      //   try {
      //     const acceptedTicketsRef = ref(db, `users/${user.uid}/acceptedTickets`);
      //     const today = format(new Date(), "dd/MM/yyyy");
      //     const snapshot = await get(acceptedTicketsRef);
      //     if (snapshot.exists()) {
      //       let todayAcceptedTickets = 0;
      //       let todayCompletedTickets = 0;
      //       snapshot.forEach((doc) => {
      //         const ticketData = doc.val();
      //         const ticketDate = format(ticketData.assignedTime, "dd/MM/yyyy");
      //         if (ticketData.completedIssue === false && ticketDate === today) {
      //           todayAcceptedTickets++;
      //         }
      //         if (ticketData.completedIssue === true && ticketDate === today) {
      //           todayCompletedTickets++;
      //         }
      //       });
      //       // Increment acceptedTicketNumber instead of replacing it
      //       await update(ref(db, `users/${user.uid}`), {
      //         todayAcceptedTickets: todayAcceptedTickets,
      //         todayCompletedTickets: todayCompletedTickets,
      //       });
      //     }
      //   } catch (error) {
      //     console.error("Error fetching accepted tickets: ", error);
      //   }
    };

    fetchAcceptedTickets();
  }, []); // Run this effect when user changes

  const handleAssignToMe = async (ticket) => {
    try {
      await updateTicket({
        ticketId: ticket._id,
        acceptedTicketByUserId: authUser._id,
        assigned: true,
        assignedAt: Date.now(),
      });
      // window.location.reload();
    } catch (error) {
      console.error("Error assigning ticket: ", error);
      //   setError("Failed to assign ticket.");
    }
  };
  const handleAssignToMe2 = async (requirement) => {
    try {
      await updateRequirement({
        requirementId: requirement._id,
        acceptedTicketByUserId: authUser._id,
        assigned: true,
        assignedTime: Date.now(),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error assigning ticket: ", error);
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
          tickets.filter((ticket) => !ticket.acceptedTicketByUserId).length >
          0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tickets.filter((ticket) => !ticket.acceptedTicketByUserId).map((ticket) => (
                <div
                  key={ticket._id}
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
                        <p>{getFormattedDate(ticket.submissionTime)} at</p>
                        <p>{getFormattedTime(ticket.submissionTime)}</p>
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
        ) : requirements.filter(
            (requirement) => !requirement.acceptedTicketByUserId
          ).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {requirements
              .filter((requirement) => !requirement.acceptedTicketByUserId)
              .map((requirement, index) => (
                <div className="" key={requirement._id}>
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
                          <h2 className="text-xl font-semibold mb-2">
                            Form :-
                          </h2>
                          <p className="text-gray-600 mb-1">
                            {getFormattedDate(requirement.endingDate)} at{" "}
                            {requirement.endingTime}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <h2 className="text-xl font-semibold  mb-2">
                            Address
                          </h2>
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
}

export default ITteamPage;
