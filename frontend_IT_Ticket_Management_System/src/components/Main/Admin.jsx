import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { ref, get } from "firebase/database";
import ItTable from "./sub-Admin/ITteam.Admin";
import { getAuth } from "firebase/auth";
import TicketAdmin from "./sub-Admin/TicketAdmin";

const Admin = () => {
  const [ticketView, setTicketView] = useState(true);
  const [itMemberView, setItMemberView] = useState(false);
  const [facultyView, setFacultyView] = useState(false);
  const [itAssignedView, setItAssignedView] = useState(false);
  const [itExecutiveView, setItExecutiveView] = useState(false);
  const [liveUser, setLiveUser] = useState([]);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Ensure currentUser is available before making the request
        if (currentUser) {
          const userRef = ref(db, `users/${currentUser.uid}`);
          const userSnapshot = await get(userRef);

          if (userSnapshot.exists()) {
            // Set the user data from snapshot
            setLiveUser(userSnapshot.val());
          } else {
            console.log("No user data found");
          }
        } else {
          console.log("User is not logged in");
        }
      } catch (error) {
        console.error("Error fetching live user:", error);
      }
    };

    fetchUserData();
  }, [currentUser]); // Include currentUser in the dependency array

  return (
    <div className="flex ">
      <header className="min-h-[calc(100vh-76px)] bg-gray-300 w-80 flex justify-center  border-r border-gray-600 py-10 ">
        <div className="grid h-28 text-xl gap-2">
          <button
            onClick={() => {
              setTicketView(true);
              setItMemberView(false);
              setFacultyView(false);
              setItExecutiveView(false);
            }}
            className={`flex  items-center gap-4  py-3 ${
              ticketView
                ? "text-gray-600  border-l-4  border-gray-700  rounded-sm bg-gray-200 px-12"
                : "pl-[52px] pr-[48px]"
            }`}
          >
            <i className="fa-solid fa-ticket"></i>
            <p>All Tickets</p>
          </button>
          {liveUser.role === "admin" && (
            <button
              onClick={() => {
                setTicketView(false);
                setItMemberView(false);
                setFacultyView(false);
                setItExecutiveView(true);
              }}
              className={`flex  items-center gap-4  py-3 ${
                itExecutiveView
                  ? "text-gray-600  border-l-4  border-gray-700  rounded-sm bg-gray-200 px-12"
                  : "pl-[52px] pr-[48px]"
              }`}
            >
              <i className="fa-solid fa-users-gear"></i> <p>IT Admin</p>
            </button>
          )}
          <button
            onClick={() => {
              setTicketView(false);
              setItMemberView(true);
              setFacultyView(false);
              setItExecutiveView(false);
            }}
            className={`flex  items-center gap-4  py-3 ${
              itMemberView
                ? "text-gray-600  border-l-4  border-gray-700  rounded-sm bg-gray-200 px-12"
                : "pl-[52px] pr-[48px]"
            }`}
          >
            <i className="fa-solid fa-users-gear"></i> <p>IT members</p>
          </button>
          <button
            onClick={() => {
              setTicketView(false);
              setItMemberView(false);
              setFacultyView(true);
              setItAssignedView(false);
              setItExecutiveView(false);
            }}
            className={`flex  items-center gap-4 py-3 ${
              facultyView
                ? "text-gray-600  border-l-4  border-gray-700  rounded-sm bg-gray-200 px-12"
                : "pl-[52px] pr-[48px]"
            }`}
          >
            <i className="fa-solid fa-users-rectangle"></i> <p>Faculties</p>
          </button>
        </div>
      </header>
      <div className="w-full  min-h-[calc(100vh-76px)]">
        {ticketView && (
          <TicketAdmin />
        )}
        {itExecutiveView && (
          <div className="p-5">
            <ItTable
              itrole={"it-admin-executive"}
              itAssignedView={itAssignedView}
              notViewAssignOption={ticketView}
            />
          </div>
        )}
        {itMemberView && (
          <div className="p-5">
            <ItTable
              itrole={"it-team"}
              itAssignedView={itAssignedView}
              notViewAssignOption={ticketView}
            />
          </div>
        )}
        {facultyView && (
          <div className="p-5">
            <ItTable itrole={"faculty"} notViewAssignOption={ticketView} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
