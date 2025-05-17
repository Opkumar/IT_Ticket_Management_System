// import { useState, useEffect } from "react";
// import TicketAdmin from "@/components/TicketAdminComponent";
// import ItTable from "@/components/ItTableComponent";
// import useTicketStore from "@/store/useTicketStore";
// import useAuthStore from "@/store/useAuthStore";

// function AdminPage() {
//   const [activeView, setActiveView] = useState("tickets");
//   const [sidebarExpanded, setSidebarExpanded] = useState(false);

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

//   const navItems = [
//     {
//       id: "tickets",
//       label: "All Tickets",
//       icon: "fa-solid fa-ticket",
//     },
//     {
//       id: "it-members",
//       label: "IT members",
//       icon: "fa-solid fa-users-gear",
//     },
//     {
//       id: "faculties",
//       label: "Faculties",
//       icon: "fa-solid fa-users-rectangle",
//     },
//   ];

//   return (
//     <div className="flex">
//       <aside
//         className={`min-h-[calc(100vh-76px)] border-r border-gray-300 bg-gray-100 shadow-lg transition-all duration-300 ease-in-out ${
//           sidebarExpanded ? "w-64" : "w-20"
//         }`}
//         onMouseEnter={() => setSidebarExpanded(true)}
//         onMouseLeave={() => setSidebarExpanded(false)}
//       >
//         <div className="flex flex-col py-8 h-full">
//           {navItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActiveView(item.id)}
//               className={`flex items-center  gap-4 py-4 px-4 mb-2 mx-2 rounded-lg transition-all duration-200 ${
//                 activeView === item.id
//                   ? "bg-gray-700 text-white shadow-md"
//                   : "text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               <i className={`${item.icon} ml-1 text-xl w-6 text-center`}></i>
//               <span
//                 className={`whitespace-nowrap ${
//                   sidebarExpanded ? "opacity-100" : "opacity-0"
//                 } transition-opacity duration-200`}
//               >
//                 {item.label}
//               </span>
//             </button>
//           ))}
//         </div>
//       </aside>

//       <main className="w-full min-h-[calc(100vh-76px)] bg-gray-50">
//         {activeView === "tickets" && (
//           <TicketAdmin allTickets={allTickets} allUsers={allUsers} />
//         )}
//         {activeView === "it-members" && (
//           <div className="p-5">
//             <ItTable
//               itrole={"it-team"}
//               itAssignedView={false}
//               notViewAssignOption={activeView === "tickets"}
//               allTickets={allTickets}
//               allUsers={allUsers}
//             />
//           </div>
//         )}
//         {activeView === "faculties" && (
//           <div className="p-5">
//             <ItTable
//               itrole={"faculty"}
//               notViewAssignOption={activeView === "tickets"}
//               allTickets={allTickets}
//               allUsers={allUsers}
//             />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default AdminPage;
"use client";

import { useState, useEffect } from "react";
import { Menu, X, Ticket, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import TicketAdmin from "@/components/TicketAdminComponent";
import ItTable from "@/components/ItTableComponent";
import useTicketStore from "@/store/useTicketStore";
import useAuthStore from "@/store/useAuthStore";

export default function AdminPage() {
  const [activeView, setActiveView] = useState("tickets");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    allTickets,
    getAllTickets,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useTicketStore();
  const { getAllUsers, allUsers } = useAuthStore();

  useEffect(() => {
    getAllTickets();
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [getAllTickets, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const navItems = [
    { id: "tickets", label: "All Tickets", icon: Ticket },
    { id: "it-members", label: "IT Members", icon: Users },
    { id: "faculties", label: "Faculties", icon: Building2 },
  ];

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-white px-4 sm:h-16 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for mobile (overlay) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-white transition-transform duration-300 ease-in-out md:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center border-b px-4 sm:h-16">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
          <ScrollArea className="flex-1 py-2">
            <nav className="grid gap-1 px-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  className={`flex justify-start gap-3 ${
                    activeView === item.id ? "bg-gray-800 text-white" : ""
                  }`}
                  onClick={() => {
                    setActiveView(item.id);
                    closeSidebar();
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Sidebar for desktop (persistent) */}
        <aside className="hidden w-64 flex-col border-r bg-white md:flex">
          <div className="flex h-14 items-center border-b px-4 sm:h-16">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <ScrollArea className="flex-1 py-2">
            <nav className="grid gap-1 px-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  className={`flex justify-start gap-3 ${
                    activeView === item.id ? "bg-gray-800 text-white" : ""
                  }`}
                  onClick={() => setActiveView(item.id)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">
            {activeView === "tickets" && (
              <TicketAdmin allTickets={allTickets} allUsers={allUsers} />
            )}
            {activeView === "it-members" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">IT Team Members</h2>
                <Separator className="mb-4" />
                <ItTable
                  itrole="it-team"
                  itAssignedView={false}
                  notViewAssignOption={activeView === "tickets"}
                  allTickets={allTickets}
                  allUsers={allUsers}
                />
              </div>
            )}
            {activeView === "faculties" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Faculty Members</h2>
                <Separator className="mb-4" />
                <ItTable
                  itrole="faculty"
                  notViewAssignOption={activeView === "tickets"}
                  allTickets={allTickets}
                  allUsers={allUsers}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
