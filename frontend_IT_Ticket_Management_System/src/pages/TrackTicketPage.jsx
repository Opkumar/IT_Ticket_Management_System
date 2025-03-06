import { useEffect, useState } from "react";
import { format } from "date-fns";
import TrackTicketView from "@/components/TrackTicketView";
import RequirementComponent from "@/components/RequirementComponent";
import useTicketStore from "@/store/useTicketStore";
import { getFormattedDate, getFormattedTime } from "@/utils/dateTimeUtils";

function TrackTicketPage() {
  const [tractView, setTrackView] = useState(true);
  const [ticketIndex, setTicketIndex] = useState(null);
  const [view, setView] = useState(true);

  const { getUserTickets, userTickets: ticketTracking ,subscribeToMessages, unsubscribeFromMessages} = useTicketStore();


  useEffect(() => {
    const fetchTicketData = () => {
      try {
         getUserTickets(false);
        subscribeToMessages();

        return () => unsubscribeFromMessages();
    
      } catch (error) {
        console.error("Fetching ticket data error:", error);
      }
    };

    fetchTicketData();
  }, [subscribeToMessages, unsubscribeFromMessages]);

 

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
                    !ticket.completedIssue &&
                  (
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
                              Priority: {ticket.urgent}
                            </p>
                            <div className="flex gap-1 text-sm">
                              <p>{getFormattedDate(ticket.submissionTime)} at</p>
                              <p>{getFormattedTime(ticket.submissionTime)}</p>
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
        <RequirementComponent data={false} />
      )}
    </div>
  );
}

export default TrackTicketPage;
