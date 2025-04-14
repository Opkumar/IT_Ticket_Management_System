"use client"

import { useState, useEffect } from "react"
import TicketAdmin from "@/components/TicketAdminComponent"
import ItTable from "@/components/ItTableComponent"
import useTicketStore from "@/store/useTicketStore"
import useAuthStore from "@/store/useAuthStore"

function AdminPage() {
  const [activeView, setActiveView] = useState("tickets")
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  const { allTickets, getAllTickets, subscribeToMessages, unsubscribeFromMessages } = useTicketStore()
  const { getAllUsers, allUsers } = useAuthStore()

  useEffect(() => {
    getAllTickets()
    subscribeToMessages()
    return () => unsubscribeFromMessages()
  }, [])

  useEffect(() => {
    getAllUsers()
  }, [])

  const navItems = [
    {
      id: "tickets",
      label: "All Tickets",
      icon: "fa-solid fa-ticket",
    },
    {
      id: "it-members",
      label: "IT members",
      icon: "fa-solid fa-users-gear",
    },
    {
      id: "faculties",
      label: "Faculties",
      icon: "fa-solid fa-users-rectangle",
    },
  ]

  return (
    <div className="flex">
      <aside
        className={`min-h-[calc(100vh-76px)] border-r border-gray-300 bg-gray-100 shadow-lg transition-all duration-300 ease-in-out ${
          sidebarExpanded ? "w-64" : "w-20"
        }`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="flex flex-col py-8 h-full">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center  gap-4 py-4 px-4 mb-2 mx-2 rounded-lg transition-all duration-200 ${
                activeView === item.id ? "bg-gray-700 text-white shadow-md" : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <i className={`${item.icon} ml-1 text-xl w-6 text-center`}></i>
              <span
                className={`whitespace-nowrap ${sidebarExpanded ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <main className="w-full min-h-[calc(100vh-76px)] bg-gray-50">
        {activeView === "tickets" && <TicketAdmin allTickets={allTickets} allUsers={allUsers} />}
        {activeView === "it-members" && (
          <div className="p-5">
            <ItTable
              itrole={"it-team"}
              itAssignedView={false}
              notViewAssignOption={activeView === "tickets"}
              allTickets={allTickets}
              allUsers={allUsers}
            />
          </div>
        )}
        {activeView === "faculties" && (
          <div className="p-5">
            <ItTable
              itrole={"faculty"}
              notViewAssignOption={activeView === "tickets"}
              allTickets={allTickets}
              allUsers={allUsers}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminPage

// import React, { useState, useEffect } from "react";
// import TicketAdmin from "@/components/TicketAdminComponent";
// import ItTable from "@/components/ItTableComponent";
// import useTicketStore from "@/store/useTicketStore";
// import useAuthStore from "@/store/useAuthStore";
// function AdminPage() {
//   const [ticketView, setTicketView] = useState(true);
//   const [itMemberView, setItMemberView] = useState(false);
//   const [facultyView, setFacultyView] = useState(false);
//   const [itAssignedView, setItAssignedView] = useState(false);
//   const {
//     allTickets,
//     getAllTickets,
//     subscribeToMessages,
//     unsubscribeFromMessages,
//   } = useTicketStore();
//   const { getAllUsers, allUsers } = useAuthStore();


//   useEffect(() => {
//     getAllTickets();
//     subscribeToMessages();
//     return () => unsubscribeFromMessages();
//   }, []);

//   useEffect(() => {
//     getAllUsers();
//   }, []);

//   return (
//     <div className="flex ">
//       <header className="min-h-[calc(100vh-76px)] bg-gray-300 w-80 flex justify-center  border-r border-gray-600 py-10 ">
//         <div className="grid h-28 text-xl gap-2">
//           <button
//             onClick={() => {
//               setTicketView(true);
//               setItMemberView(false);
//               setFacultyView(false);
//               // setItExecutiveView(false);
//             }}
//             className={`flex  items-center gap-4  py-3 ${
//               ticketView
//                 ? "text-gray-600  border-l-4  border-gray-700  rounded-sm bg-gray-200 px-12"
//                 : "pl-[52px] pr-[48px]"
//             }`}
//           >
//             <i className="fa-solid fa-ticket"></i>
//             <p>All Tickets</p>
//           </button>
//           <button
//             onClick={() => {
//               setTicketView(false);
//               setItMemberView(true);
//               setFacultyView(false);
//               // setItExecutiveView(false);
//             }}
//             className={`flex  items-center gap-4  py-3 ${
//               itMemberView
//                 ? "text-gray-600  border-l-4  border-gray-700  rounded-sm bg-gray-200 px-12"
//                 : "pl-[52px] pr-[48px]"
//             }`}
//           >
//             <i className="fa-solid fa-users-gear"></i> <p>IT members</p>
//           </button>
//           <button
//             onClick={() => {
//               setTicketView(false);
//               setItMemberView(false);
//               setFacultyView(true);
//               setItAssignedView(false);
//               // setItExecutiveView(false);
//             }}
//             className={`flex  items-center gap-4 py-3 ${
//               facultyView
//                 ? "text-gray-600  border-l-4  border-gray-700  rounded-sm bg-gray-200 px-12"
//                 : "pl-[52px] pr-[48px]"
//             }`}
//           >
//             <i className="fa-solid fa-users-rectangle"></i> <p>Faculties</p>
//           </button>
//         </div>
//       </header>
//       <div className="w-full  min-h-[calc(100vh-76px)]">
//         {ticketView && (
//           <TicketAdmin allTickets={allTickets} allUsers={allUsers} />
//         )}
//         {itMemberView && (
//           <div className="p-5">
//             <ItTable
//               itrole={"it-team"}
//               itAssignedView={itAssignedView}
//               notViewAssignOption={ticketView}
//               allTickets={allTickets}
//               allUsers={allUsers}
//             />
//           </div>
//         )}
//         {facultyView && (
//           <div className="p-5">
//             <ItTable
//               itrole={"faculty"}
//               notViewAssignOption={ticketView}
//               allTickets={allTickets}
//               allUsers={allUsers}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AdminPage;
