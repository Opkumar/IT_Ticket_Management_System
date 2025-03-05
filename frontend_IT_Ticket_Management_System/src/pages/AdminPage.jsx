import React, { useState, useEffect } from "react";
// import ItTable from "./sub-Admin/ITteam.Admin";
import TicketAdmin from "@/components/TicketAdminComponent";
import ItTable from "@/components/ItTableComponent";
import useTicketStore from "@/store/useTicketStore";
import useAuthStore from "@/store/useAuthStore";
function AdminPage() {
  const [ticketView, setTicketView] = useState(true);
  const [itMemberView, setItMemberView] = useState(false);
  const [facultyView, setFacultyView] = useState(false);
  const [itAssignedView, setItAssignedView] = useState(false);
  const { allTickets, getAllTickets } = useTicketStore();
  const { getAllUsers, allUsers } = useAuthStore();

  useEffect(() => {
    getAllTickets();
  }, []);

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="flex ">
      <header className="min-h-[calc(100vh-76px)] bg-gray-300 w-80 flex justify-center  border-r border-gray-600 py-10 ">
        <div className="grid h-28 text-xl gap-2">
          <button
            onClick={() => {
              setTicketView(true);
              setItMemberView(false);
              setFacultyView(false);
              // setItExecutiveView(false);
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
          <button
            onClick={() => {
              setTicketView(false);
              setItMemberView(true);
              setFacultyView(false);
              // setItExecutiveView(false);
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
              // setItExecutiveView(false);
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
          <TicketAdmin allTickets={allTickets} allUsers={allUsers} />
        )}
        {itMemberView && (
          <div className="p-5">
            <ItTable
              itrole={"it-team"}
              itAssignedView={itAssignedView}
              notViewAssignOption={ticketView}
              allTickets={allTickets}
              allUsers={allUsers}
            />
          </div>
        )}
        {facultyView && (
          <div className="p-5">
            <ItTable
              itrole={"faculty"}
              notViewAssignOption={ticketView}
              allTickets={allTickets}
              allUsers={allUsers}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
