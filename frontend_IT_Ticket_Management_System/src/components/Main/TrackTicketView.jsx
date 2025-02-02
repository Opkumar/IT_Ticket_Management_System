import React, { useState } from "react";
import { getDatabase, ref, update } from "firebase/database"; // Import Firebase Realtime Database
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

function TrackTicketView({ ticket, confirmationView }) {
  const [reasonView, setReasonView] = useState(false);
  const [starView, setStarView] = useState(false);
  const [confirmView, setConfirmView] = useState(true);
  const [view, setView] = useState(true);
  const [issueReason, setIssueReason] = useState("");
  const [rating, setRating] = useState(0);
  const db = getDatabase(); // Initialize Firebase Database
  const auth = getAuth(); // Initialize Firebase Authentication
  const user = auth.currentUser; // Get the currently logged-in user

  const sendRating = async (itUserId) => {
    if (!user) {
      console.error("No user logged in.");
      return;
    }
    const ticketId = new Date().getTime();
    try {
      const itUserRef = ref(db, `users/${itUserId}/sentiments/${ticketId}`);
      update(itUserRef, {
        feedback: rating,
      });
    } catch (error) {
      console.error("error in IT Executive data fetch : ", error);
    }
  };

  const userComfirmation = async (ticketId) => {
    if (!user) {
      console.error("No user logged in.");
      return;
    }
    if (!ticketId) {
      console.error("Ticket ID is required.");
      return;
    }
    try {
      const updateTicketRef = ref(db, `tickets/${ticketId}`);
      await update(updateTicketRef, {
        completedIssue: true,
        completedTime: Date.now(),
      });
      console.log("Ticket status updated successfully.");
    } catch (error) {
      console.error("Error updating ticket status: ", error);
    }
  };

  const userReason = async (ticketId) => {
    if (!user) {
      console.error("No user logged in.");
      return;
    }
    if (!ticketId) {
      console.error("Ticket ID is required.");
      return;
    }
    if (!issueReason) {
      console.error("Reason is required.");
      return;
    }
    try {
      const updateTicketRef = ref(db, `tickets/${ticketId}`);
      await update(updateTicketRef, {
        userIssueReason: true,
        resolvingIssue: false,
        userIssueReasonDetail: issueReason,
      });
      console.log("User issue reason updated successfully.");
      setIssueReason("");
    } catch (error) {
      console.error("Error updating user issue reason: ", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleString(); // Format to local date and time
  };

  return (
    <div className="m-4 bg-gray-50">
      <div className="mt-5">
        <div className="">
          <h2 className="text-xl font-semibold mb-2">{ticket.typeIssue}</h2>

          <div className="mb-3 flex justify-center">
            {ticket.issueImage && (
              <img
                src={ticket.issueImage}
                alt="issue"
                className="w-1/2 max-h-96 object-cover rounded-md border-black border"
              />
            )}
          </div>

          <p className="text-gray-600 mb-1">Details: {ticket.issueDetail}</p>
          <p className="text-gray-600 mb-1">Address: {ticket.issueAddress}</p>
          <div className="flex justify-between items-center mt-3 text-gray-600 text-sm">
            <p className="font-bold">
              Priority: {ticket.urgent ? "Urgent" : "Normal"}
            </p>
          </div>
          <div className="text-sm">
            <p>Raise Ticket Date : {ticket.date} </p>
            <p>Raise Ticket Time : {ticket.time}</p>
          </div>
        </div>
        <div className="w-full max-w-2xl mx-auto px-4 py-8">
          <div className="relative">
            <div
              key={ticket.acceptedTicketByUserId}
              className="relative flex items-center pb-12"
            >
              <div
                className={`absolute left-5 top-5 -ml-px mt-0.5 h-full w-0.5 ${
                  ticket.assigned ? "bg-green-500" : "bg-gray-300"
                }`}
                aria-hidden="true"
              />
              <div
                className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  ticket.assigned ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {ticket.assigned ? (
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-white">
                    {ticket.cceptedTicketByUserId}
                  </span>
                )}
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <span
                  className={`text-sm font-medium ${
                    ticket.assigned ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  <p>Assigned</p>
                  {ticket.assigned && <p>{formatDate(ticket.assignedAt)}</p>}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div key={ticket.id} className="relative flex items-center pb-12">
              <div
                className={`absolute left-5 top-5 -ml-px mt-0.5 h-full w-0.5 ${
                  ticket.startToTicket ? "bg-green-500" : "bg-gray-300"
                }`}
                aria-hidden="true"
              />
              <div
                className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  ticket.startToTicket ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {ticket.startToTicket ? (
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-white">{ticket.startToTicket}</span>
                )}
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <span
                  className={`text-sm font-medium ${
                    ticket.startToTicket ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  <p>Start working on Ticket</p>
                  {ticket.startToTicket && (
                    <p>{formatDate(ticket.startWorkingOnTicketIssueTime)}</p>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative flex items-center pb-12">
              <div
                className={`absolute left-5 top-5 -ml-px mt-0.5 h-full w-0.5 ${
                  ticket.reachIssueAddress ? "bg-green-500" : "bg-gray-300"
                }`}
                aria-hidden="true"
              />
              <div
                className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  ticket.reachIssueAddress ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {ticket.reachIssueAddress ? (
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-white">{ticket.reachIssueAddress}</span>
                )}
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <span
                  className={`text-sm font-medium ${
                    ticket.reachIssueAddress
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  <p>Reached Address</p>
                  {ticket.reachIssueAddress && (
                    <p>{formatDate(ticket.reachAddressIssueTime)}</p>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative flex items-center pb-12">
              <div
                className={`absolute left-5 top-5 -ml-px mt-0.5 h-full w-0.5 ${
                  ticket.solvingIssue ? "bg-green-500" : "bg-gray-300"
                }`}
                aria-hidden="true"
              />
              <div
                className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  ticket.solvingIssue ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {ticket.solvingIssue ? (
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-white">{ticket.solvingIssue}</span>
                )}
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <span
                  className={`text-sm font-medium ${
                    ticket.solvingIssue ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  <p>Solving Issue</p>
                  {ticket.solvingIssue && (
                    <p>{formatDate(ticket.solvingIssueTime)}</p>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative flex items-center pb-12">
              {ticket.userIssueReason && (
                <div
                  className={`absolute left-5 top-5 -ml-px mt-0.5 h-full w-0.5 ${
                    ticket.completedIssueByIt ? "bg-green-500" : "bg-gray-300"
                  }`}
                  aria-hidden="true"
                />
              )}
              <div
                className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  ticket.completedIssueByIt
                    ? ticket.userIssueReason
                      ? "bg-red-500"
                      : "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                {ticket.completedIssueByIt ? (
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-white">
                    {ticket.completedIssueByIt}
                  </span>
                )}
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <span
                  className={`text-sm font-medium ${
                    ticket.completedIssueByIt
                      ? ticket.userIssueReason
                        ? ` text-red-500`
                        : ` text-green-500`
                      : "text-gray-500"
                  }`}
                >
                  <p>Completed Issue</p>
                  {ticket.completedIssueByIt && (
                    <p>{formatDate(ticket.completedIssueByItTime)}</p>
                  )}
                </span>
              </div>
            </div>
          </div>

          {ticket.userIssueReason && (
            <div className="relative">
              <div className="relative flex items-center pb-12">
                <div
                  className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    ticket.resolvingIssue ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  {ticket.resolvingIssue ? (
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-white">{ticket.resolvingIssue}</span>
                  )}
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <span
                    className={`text-sm font-medium ${
                      ticket.resolvingIssue ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    <p>Resolving Issue</p>
                    {ticket.resolvingIssue && (
                      <p>{formatDate(ticket.resolvingIssueTime)}</p>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {confirmationView && view && (ticket.completedIssueByIt || ticket.resolvingIssue)  &&(
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
              {/* Confirmation Section */}
              {ticket.completedIssueByIt &&
                
                confirmView &&
                !reasonView &&
                !starView && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Your Confirmation
                    </h2>
                    <p className="text-gray-600">
                      Is your raised issue resolved?
                    </p>
                    <div className="flex gap-4 justify-end mt-4">
                      {!ticket.resolvingIssue &&(<button
                        onClick={() => setReasonView(true)}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                      >
                        No
                      </button>)}
                      <button
                        onClick={() => (
                          userComfirmation(ticket.ticketId), setStarView(true)
                        )}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                )}

              {/* Reason Input Section */}
              {reasonView && !starView && ticket.completedIssueByIt && (
                <div className="space-y-4">
                  <button
                    onClick={() => setReasonView(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fa-solid fa-arrow-left"></i> Back
                  </button>
                  <h2 className="text-xl font-bold text-gray-800">
                    Provide a Reason
                  </h2>
                  <p className="text-gray-600">
                    Please enter your reason in detail so we can address your
                    issue effectively.
                  </p>
                  <textarea
                    type="text"
                    value={issueReason}
                    onChange={(e) => setIssueReason(e.target.value)}
                    placeholder="Enter your reason..."
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:ring-blue-200"
                    rows="4"
                    required
                  ></textarea>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                    onClick={() => (
                      userReason(ticket.ticketId),
                      setReasonView(false),
                      setConfirmView(false),
                      setView(false)
                    )}
                  >
                    Submit
                  </button>
                </div>
              )}

              {/* Star Rating Section */}
              {starView && !reasonView && ticket.completedIssueByIt && (
                <div className="space-y-4 mt-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Rate the IT Executive's Work
                  </h2>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`cursor-pointer text-3xl ${
                          star <= rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                      onClick={() => (setStarView(false),setView(false))}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                      onClick={() => (
                        sendRating(ticket.acceptedTicketByUserId),
                        setStarView(false),
                        setView(false)
                      )}
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}

export default TrackTicketView;
