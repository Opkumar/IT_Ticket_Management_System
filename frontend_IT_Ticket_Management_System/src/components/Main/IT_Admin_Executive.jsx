import React, { useState, useEffect } from "react";
import { getDocument } from "../config/service";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { db } from "../config/firebaseConfig";
import { ref, onValue, get } from "firebase/database";
import { format } from "date-fns"; // To format the date and time
import ItTable from "../ItTableComponent";
import ComAdminRequirementList from "../ComAdminRequirementListComponent";
import TicketAdmin from "./sub-Admin/TicketAdmin";

const IT_Admin_Executive = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(""); // Global filter state
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [ticketView, setTicketView] = useState(true);
  const [itMemberView, setItMemberView] = useState(false);
  const [facultyView, setFacultyView] = useState(false);
  const [itAssignedView, setItAssignedView] = useState(false);
  const [isOpenView, setIsOpenView] = useState(true);
  const [ticketData, setTicketData] = useState({});
  const [ticketDetails, setTicketDetails] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const detailHistory = async (acceptedTicketByUserId, ticketId) => {
    try {
      const ticketDetailRef = ref(
        db,
        `users/${acceptedTicketByUserId}/acceptedTickets/${ticketId}`
      ); // Fixed path
      const snapshot = await get(ticketDetailRef);
      const ticketDetails = snapshot.val();
      return ticketDetails; // Return the details
    } catch (error) {
      console.error("Fetching ticketDetails error:", error);
    }
    return null; // Return null if there's an error
  };

  const handleRowClickData = async (row) => {
    if (expandedRow === row.id) {
      setExpandedRow(null);
      setTicketDetails(null); // Clear ticket details
    } else {
      // If expanding, fetch the details
      const details = await detailHistory(
        row.original.acceptedTicketByUserId,
        row.original.id
      );
      setTicketDetails(details); // Update state with fetched details
      setExpandedRow(row.id); // Expand the row
    }
  };

  const [selectedFilters, setSelectedFilters] = useState({
    urgent: "",
    typeIssue: "",
    assigned: "",
    status: "",
    itUserId: "",
  }); // Track selected filters for columns

  useEffect(() => {
    const fetchData = () => {
      const ticketRef = ref(db, "tickets");
      onValue(ticketRef, (snapshot) => {
        const ticketList = [];
        snapshot.forEach((childSnapshot) => {
          const ticketData = {
            id: childSnapshot.key,
            ...childSnapshot.val(),
            date: format(
              new Date(childSnapshot.val().submissionTime),
              "dd/MM/yyyy"
            ),
            time: format(
              new Date(childSnapshot.val().submissionTime),
              "HH:mm:ss"
            ),
            assigned: childSnapshot.val().assignedName,
            itUserId: childSnapshot.val().acceptedTicketByUserId,
          };
          ticketList.push(ticketData);
        });
        setData(ticketList);
      });
    };

    fetchData();
  }, []);



  const columns = [
    {
      accessorKey: "issueDetail",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("issueDetail")}</div>
      ),
    },
    {
      accessorKey: "urgent",
      header: "Priority",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("urgent") ? (
            <p className="text-red-400">Urgent</p>
          ) : (
            <p className="text-blue-400">Normal</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "typeIssue",
      header: "Category",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("typeIssue")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "Ticket Raised ",
      cell: ({ row }) => (
        <div className="lowercase">
          {row.getValue("date")} at {row.original.time}
        </div>
      ),
    },
    {
      accessorKey: "itUserId",
      header: "Assigned to",
      cell: ({ row }) => {
        const assignedUserId = row.getValue("itUserId");
        const [itUserData, setItUserData] = useState(null);

        useEffect(() => {
          if (assignedUserId) {
            const fetchData = async () => {
              try {
                const docData = await getDocument("users", assignedUserId);
                setItUserData(docData);
              } catch (error) {
                console.error("Error fetching user data:", error);
              }
            };
            fetchData();
          }
        }, [assignedUserId]);

        return assignedUserId ? (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button className="text-orange-400" variant="link">
                {itUserData?.fullName}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src={itUserData?.photoURL} />
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">
                    {itUserData?.fullName}
                  </h4>
                  <p className="text-sm">{itUserData?.email}</p>
                  <div className="flex items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      Role : {itUserData?.role}
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => (
                  setTicketData(row.original), setItAssignedView(true)
                )}
                className="border-none bg-transparent text-red-400"
              >
                No Assign
              </Button>
            </DialogTrigger>
            <DialogContent className=" max-w-[1000px]">
              <div className="">
                <DialogHeader>
                  <DialogTitle>Assign To IT Member</DialogTitle>
                </DialogHeader>
                <ItTable
                  itrole={"it-team"}
                  itAssignedView={itAssignedView}
                  ticketDataOfRow={ticketData}
                />
              </div>
            </DialogContent>
          </Dialog>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId);
        if (filterValue.toLowerCase() === "no assign") {
          return !value; // Returns true for rows with no assigned user
        }
        return (
          value &&
          String(value).toLowerCase().includes(filterValue.toLowerCase())
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const [selectedFilters, setSelectedFilters] = useState({
          assigned: "false",
          startToTicket: "false",
          reachIssueAddress: "false",
          solvingIssue: "false",
          completedIssue: "false",
        });

        // Fetch ticket details
        useEffect(() => {
          const fetchTicketDetails = async () => {
            if (row.original.acceptedTicketByUserId) {
              const ticketDetailRef = ref(
                db,
                `users/${row.original.acceptedTicketByUserId}/acceptedTickets/${row.original.id}`
              );

              try {
                const ticketDetails = await get(ticketDetailRef);
                const ticketData = ticketDetails.val(); // The fetched data

                // Update selectedFilters based on fetched ticket data
                setSelectedFilters((prev) => ({
                  ...prev,
                  assigned: ticketData?.assigned ? "true" : "false",
                  startToTicket: ticketData?.startToTicket ? "true" : "false",
                  reachIssueAddress: ticketData?.reachIssueAddress
                    ? "true"
                    : "false",
                  solvingIssue: ticketData?.solvingIssue ? "true" : "false",
                  completedIssue: ticketData?.completedIssue ? "true" : "false",
                }));
              } catch (error) {
                console.error("Error fetching ticket details:", error);
              }
            }
          };

          fetchTicketDetails();
        }, [row.original.acceptedTicketByUserId, row.original.id]);

        // Render based on selectedFilters state
        return (
          <div className="">
            {selectedFilters.assigned === "true" &&
              selectedFilters.startToTicket === "false" &&
              selectedFilters.reachIssueAddress === "false" &&
              selectedFilters.solvingIssue === "false" &&
              selectedFilters.completedIssue === "false" && (
                <h2 className="text-red-400">Pending</h2>
              )}
            {selectedFilters.assigned === "true" &&
              selectedFilters.startToTicket === "true" &&
              selectedFilters.reachIssueAddress === "false" &&
              selectedFilters.solvingIssue === "false" &&
              selectedFilters.completedIssue === "false" && (
                <p className="text-blue-400">In Progress</p>
              )}
            {selectedFilters.assigned === "true" &&
              selectedFilters.startToTicket === "true" &&
              selectedFilters.reachIssueAddress === "true" &&
              selectedFilters.solvingIssue === "false" &&
              selectedFilters.completedIssue === "false" && (
                <p className="text-blue-400">In Progress</p>
              )}
            {selectedFilters.assigned === "true" &&
              selectedFilters.startToTicket === "true" &&
              selectedFilters.reachIssueAddress === "true" &&
              selectedFilters.solvingIssue === "true" &&
              selectedFilters.completedIssue === "false" && (
                <p className="text-blue-400">In Progress</p>
              )}
            {selectedFilters.assigned === "true" &&
              selectedFilters.startToTicket === "true" &&
              selectedFilters.reachIssueAddress === "true" &&
              selectedFilters.solvingIssue === "true" &&
              selectedFilters.completedIssue === "true" && (
                <p className="text-green-400">Completed</p>
              )}

            {/* Show a placeholder if no data is available */}
            {selectedFilters.assigned === "false" &&
              selectedFilters.startToTicket === "false" &&
              selectedFilters.reachIssueAddress === "false" &&
              selectedFilters.solvingIssue === "false" &&
              selectedFilters.completedIssue === "false" && (
                <p className="text-red-400">----</p>
              )}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          // Use return to output JSX
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-slate-400"
            onClick={() => {
              const newExpandedRow = expandedRow === row.id ? null : row.id;
              handleRowClickData(row);
              setExpandedRow(newExpandedRow);
              handleRowClick(row.id);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  

  const applyFilter = (columnId, value) => {
    setColumnFilters((prev) => {
      const existingFilter = prev.find((filter) => filter.id === columnId);
      if (existingFilter) {
        // If a filter already exists for the column, update it
        return prev.map((filter) =>
          filter.id === columnId ? { ...filter, value } : filter
        );
      } else {
        // Otherwise, add a new filter for the column
        return [...prev, { id: columnId, value }];
      }
    });

    // Update selected filters state
    setSelectedFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const applyFilter2 = (columnId, value) => {
    setColumnFilters((prevFilters) => {
      const existingFilter = prevFilters.find(
        (filter) => filter.id === columnId
      );
      if (existingFilter) {
        return prevFilters.map((filter) =>
          filter.id === columnId ? { ...filter, value } : filter
        );
      } else {
        return [...prevFilters, { id: columnId, value }];
      }
    });
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnIds, filterValue) => {
      const columnsToFilter = [
        "issueDetail",
        "urgent",
        "typeIssue",
        "date",
        "time",
        "assigned",
        "status",
      ];

      // Convert filterValue to lowercase string for comparison
      const filterValueLower = String(filterValue).toLowerCase();

      return columnsToFilter.some((columnId) => {
        const value = row.getValue(columnId);

        // Handle the urgent column specifically (boolean values)
        if (columnId === "urgent") {
          return (value ? "urgent" : "normal").includes(filterValueLower);
        }

        // Handle the status column specifically (status values should be strings)
        if (columnId === "status") {
          return String(value || "in progress")
            .toLowerCase()
            .includes(filterValueLower);
        }

        // Handle 'assigned' or 'itUserId' being null/undefined for "No Assign"
        if (columnId === "itUserId" && filterValueLower === "no assign") {
          return !value; // If no assigned user, value will be null/undefined/empty
        }

        // For other columns, do a regular string comparison
        return String(value).toLowerCase().includes(filterValueLower);
      });
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

 

  return (
    <div className="flex ">
      <header className="min-h-[calc(100vh-76px)] bg-gray-300 w-80 flex justify-center  border-r border-gray-600 py-10 ">
        <div className="grid h-28 text-xl gap-2">
          <button
            onClick={() => {
              setTicketView(true);
              setItMemberView(false);
              setFacultyView(false);
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
      <div className="w-full  min-h-[calc(100vh-80px)]">
        {ticketView && (
          <TicketAdmin />
          // <div className="w-full ">
          //   <div className="flex  w-full h-10 pl-2 bg-white shadow-sm">
          //     <button
          //       className={`px-5  ${
          //         isOpenView
          //           ? "text-blue-700 border-b-4 border-blue-600 rounded-md"
          //           : "   "
          //       }`}
          //       onClick={() => setIsOpenView(true)}
          //     >
          //       Issue Tickets
          //     </button>
          //     <button
          //       className={`px-5   ${
          //         !isOpenView
          //           ? "text-blue-700  border-b-4 border-blue-600 rounded-md "
          //           : "    "
          //       }`}
          //       onClick={() => setIsOpenView(false)}
          //     >
          //       Requirement Tickets
          //     </button>
          //   </div>
          //   {isOpenView ? (
          //     <div className="w-full p-10 ">
          //       <div className="flex items-center py-4 ">
          //         <Input
          //           placeholder="Filter tickets..."
          //           value={globalFilter}
          //           onChange={(event) => setGlobalFilter(event.target.value)} // Global filter input
          //           className="max-w-sm"
          //         />
          //         <div className="flex space-x-4 ml-4 py-4">
          //           {/* Dropdown for Urgent Filter */}
          //           <DropdownMenu>
          //             <DropdownMenuTrigger asChild>
          //               <Button variant="outline">
          //                 Urgent <ChevronDown className="ml-2 h-4 w-4" />
          //               </Button>
          //             </DropdownMenuTrigger>
          //             <DropdownMenuContent>
          //               <DropdownMenuItem
          //                 onClick={() => applyFilter("urgent", true)}
          //               >
          //                 Urgent
          //               </DropdownMenuItem>
          //               <DropdownMenuItem
          //                 onClick={() => applyFilter("urgent", false)}
          //               >
          //                 Normal
          //               </DropdownMenuItem>
          //             </DropdownMenuContent>
          //           </DropdownMenu>

          //           {/* Dropdown for Type Issue Filter */}
          //           <DropdownMenu>
          //             <DropdownMenuTrigger asChild>
          //               <Button variant="outline">
          //                 Category <ChevronDown className="ml-2 h-4 w-4" />
          //               </Button>
          //             </DropdownMenuTrigger>
          //             <DropdownMenuContent>
          //               <DropdownMenuItem
          //                 onClick={() =>
          //                   applyFilter("typeIssue", "Network / Connectivity")
          //                 }
          //               >
          //                 Network / Connectivity
          //               </DropdownMenuItem>
          //               <DropdownMenuItem
          //                 onClick={() => applyFilter("typeIssue", "Laptop")}
          //               >
          //                 Laptop
          //               </DropdownMenuItem>
          //               <DropdownMenuItem
          //                 onClick={() => applyFilter("typeIssue", "Desktop")}
          //               >
          //                 Desktop
          //               </DropdownMenuItem>
          //               <DropdownMenuItem
          //                 onClick={() => applyFilter("typeIssue", "Printer")}
          //               >
          //                 Printer
          //               </DropdownMenuItem>
          //               <DropdownMenuItem
          //                 onClick={() =>
          //                   applyFilter("typeIssue", "CCTV Camera")
          //                 }
          //               >
          //                 CCTV Camera
          //               </DropdownMenuItem>
          //               <DropdownMenuItem
          //                 onClick={() =>
          //                   applyFilter("typeIssue", "Software Issue")
          //                 }
          //               >
          //                 Software Issue
          //               </DropdownMenuItem>
          //               <DropdownMenuItem
          //                 onClick={() =>
          //                   applyFilter("typeIssue", "Cloud Service Issue")
          //                 }
          //               >
          //                 Cloud Service Issue
          //               </DropdownMenuItem>
          //               <DropdownMenuItem
          //                 onClick={() =>
          //                   applyFilter(
          //                     "typeIssue",
          //                     "Email & Communication Issue"
          //                   )
          //                 }
          //               >
          //                 Email & Communication Issue
          //               </DropdownMenuItem>
          //               <DropdownMenuItem
          //                 onClick={() =>
          //                   applyFilter(
          //                     "typeIssue",
          //                     "User Account & Access Issue"
          //                   )
          //                 }
          //               >
          //                 User Account & Access Issue
          //               </DropdownMenuItem>
          //               <DropdownMenuItem
          //                 onClick={() =>
          //                   applyFilter("typeIssue", "IT Support Services")
          //                 }
          //               >
          //                 IT Support Services
          //               </DropdownMenuItem>
          //               <DropdownMenuItem
          //                 onClick={() =>
          //                   applyFilter("typeIssue", "Backup & Recovery Issues")
          //                 }
          //               >
          //                 Backup & Recovery Issues
          //               </DropdownMenuItem>
          //               {/* Add more categories as needed */}
          //             </DropdownMenuContent>
          //           </DropdownMenu>

          //           {/* Dropdown for Assigned Filter */}
          //           <DropdownMenu>
          //             <DropdownMenuTrigger asChild>
          //               <Button variant="outline">
          //                 Assigned To <ChevronDown className="ml-2 h-4 w-4" />
          //               </Button>
          //             </DropdownMenuTrigger>
          //             <DropdownMenuContent>
          //               <DropdownMenuItem
          //                 onClick={() => applyFilter2("itUserId", "No Assign")}
          //               >
          //                 No Assign
          //               </DropdownMenuItem>

          //               {/* Add more users as needed */}
          //             </DropdownMenuContent>
          //           </DropdownMenu>

          //           {/* Dropdown for Status Filter */}
          //           {/* <DropdownMenu>
          //         <DropdownMenuTrigger asChild>
          //           <Button variant="outline">
          //             Status <ChevronDown className="ml-2 h-4 w-4" />
          //           </Button>
          //         </DropdownMenuTrigger>
          //         <DropdownMenuContent>
          //           <DropdownMenuItem
          //             onClick={() => applyFilter4("status", "Pending")}
          //           >
          //             Pending
          //           </DropdownMenuItem>
          //           <DropdownMenuItem
          //             onClick={() => applyFilter4("status", "In Progress")}
          //           >
          //             In Progress
          //           </DropdownMenuItem>
          //           <DropdownMenuItem
          //             onClick={() => applyFilter4("status", "Completed")}
          //           >
          //             Completed
          //           </DropdownMenuItem>
          //         </DropdownMenuContent>
          //       </DropdownMenu> */}
          //         </div>
          //         <DropdownMenu>
          //           <DropdownMenuTrigger asChild>
          //             <Button variant="outline" className="ml-auto">
          //               Columns <ChevronDown className="ml-2 h-4 w-4" />
          //             </Button>
          //           </DropdownMenuTrigger>
          //           <DropdownMenuContent align="end">
          //             {table
          //               .getAllColumns()
          //               .filter((column) => column.getCanHide())
          //               .map((column) => {
          //                 return (
          //                   <DropdownMenuCheckboxItem
          //                     key={column.id}
          //                     className="capitalize"
          //                     checked={column.getIsVisible()}
          //                     onCheckedChange={(value) =>
          //                       column.toggleVisibility(!!value)
          //                     }
          //                   >
          //                     {column.id}
          //                   </DropdownMenuCheckboxItem>
          //                 );
          //               })}
          //           </DropdownMenuContent>
          //         </DropdownMenu>
          //       </div>

          //       <div className="rounded-md border">
          //         <Table>
          //           <TableHeader>
          //             {table.getHeaderGroups().map((headerGroup) => (
          //               <TableRow key={headerGroup.id}>
          //                 {headerGroup.headers.map((header) => (
          //                   <TableHead key={header.id}>
          //                     {header.isPlaceholder
          //                       ? null
          //                       : flexRender(
          //                           header.column.columnDef.header,
          //                           header.getContext()
          //                         )}
          //                   </TableHead>
          //                 ))}
          //               </TableRow>
          //             ))}
          //           </TableHeader>
          //           <TableBody>
          //             {table.getRowModel().rows?.length ? (
          //               table.getRowModel().rows.map((row) => (
          //                 <React.Fragment key={row.id}>
          //                   <TableRow
          //                     data-state={row.getIsSelected() ? "selected" : ""}
          //                     className={
          //                       row.getIsSelected() ? "bg-blue-100" : ""
          //                     }
          //                   >
          //                     {row.getVisibleCells().map((cell) => (
          //                       <TableCell key={cell.id}>
          //                         {flexRender(
          //                           cell.column.columnDef.cell,
          //                           cell.getContext()
          //                         )}
          //                       </TableCell>
          //                     ))}
          //                   </TableRow>
          //                   {expandedRow === row.id && ( // Conditional rendering for expanded row
          //                     <TableRow
          //                       data-state={
          //                         row.getIsSelected() ? "selected" : ""
          //                       }
          //                       className={
          //                         row.getIsSelected() ? "bg-blue-100" : ""
          //                       }
          //                     >
          //                       <TableCell colSpan={columns.length}>
          //                         <div className="p-4">
          //                           <h4 className="font-semibold text-2xl mb-2">
          //                             Ticket Detail
          //                           </h4>
          //                           <div>
          //                             <div className="grid gap-4">
          //                               <div className=" border rounded-sm `">
          //                                 <h2 className="text-xl ml-2 mt-2">
          //                                   Ticket Raised By :-
          //                                 </h2>
          //                                 <p className="ml-2">
          //                                   Name: {row.original.fullName}
          //                                 </p>
          //                                 <p className="ml-2 mb-2">
          //                                   Email: {row.original.email}
          //                                 </p>
          //                               </div>
          //                             </div>
          //                             {ticketDetails ? ( // Check if ticket details are available
          //                               <div className=" border rounded-sm">
          //                                 <h2 className="text-xl ml-2 mt-2">
          //                                   Ticket History
          //                                 </h2>
          //                                 <div className="flex items-center gap-2 ml-2">
          //                                   {ticketDetails.assigned ? (
          //                                     <i className="fa-solid fa-circle-check text-blue-500"></i>
          //                                   ) : (
          //                                     <i className="fa-solid fa-circle "></i>
          //                                   )}
          //                                   <div className="flex items-center gap-2">
          //                                     <p>Ticket assigned : </p>
          //                                     {ticketDetails.assigned ? (
          //                                       <p className="ml-2">
          //                                         {/* Format the assigned time */}
          //                                         {new Date(
          //                                           ticketDetails.assignedTime
          //                                         ).toLocaleString(
          //                                           "en-US", // Change to desired locale
          //                                           {
          //                                             year: "numeric",
          //                                             month: "long",
          //                                             day: "numeric",
          //                                             hour: "numeric",
          //                                             minute: "numeric",
          //                                             hour12: true, // Set to false for 24-hour format
          //                                           }
          //                                         )}
          //                                       </p>
          //                                     ) : (
          //                                       <p>null</p>
          //                                     )}
          //                                   </div>
          //                                 </div>
          //                                 <div className="flex items-center gap-2 ml-2">
          //                                   {ticketDetails.startToTicket ? (
          //                                     <i className="fa-solid fa-circle-check text-blue-500"></i>
          //                                   ) : (
          //                                     <i className="fa-solid fa-circle "></i>
          //                                   )}
          //                                   <div className="flex items-center gap-2">
          //                                     <p>Start working on Ticket : </p>
          //                                     {ticketDetails.startToTicket ? (
          //                                       <p className="ml-2">
          //                                         {/* Format the assigned time */}
          //                                         {new Date(
          //                                           ticketDetails.startWorkingOnTicketIssueTime
          //                                         ).toLocaleString(
          //                                           "en-US", // Change to desired locale
          //                                           {
          //                                             year: "numeric",
          //                                             month: "long",
          //                                             day: "numeric",
          //                                             hour: "numeric",
          //                                             minute: "numeric",
          //                                             hour12: true, // Set to false for 24-hour format
          //                                           }
          //                                         )}
          //                                       </p>
          //                                     ) : (
          //                                       <p>null</p>
          //                                     )}
          //                                   </div>
          //                                 </div>
          //                                 <div className="flex items-center gap-2 ml-2">
          //                                   {ticketDetails.reachIssueAddress ? (
          //                                     <i className="fa-solid fa-circle-check text-blue-500"></i>
          //                                   ) : (
          //                                     <i className="fa-solid fa-circle "></i>
          //                                   )}
          //                                   <div className="flex items-center gap-2">
          //                                     <p>Reach Issue Address : </p>
          //                                     {ticketDetails.reachIssueAddress ? (
          //                                       <p className="ml-2">
          //                                         {/* Format the assigned time */}
          //                                         {new Date(
          //                                           ticketDetails.reachAddressIssueTime
          //                                         ).toLocaleString(
          //                                           "en-US", // Change to desired locale
          //                                           {
          //                                             year: "numeric",
          //                                             month: "long",
          //                                             day: "numeric",
          //                                             hour: "numeric",
          //                                             minute: "numeric",
          //                                             hour12: true, // Set to false for 24-hour format
          //                                           }
          //                                         )}
          //                                       </p>
          //                                     ) : (
          //                                       <p>null</p>
          //                                     )}
          //                                   </div>
          //                                 </div>
          //                                 <div className="flex items-center gap-2 ml-2">
          //                                   {ticketDetails.solvingIssue ? (
          //                                     <i className="fa-solid fa-circle-check text-blue-500"></i>
          //                                   ) : (
          //                                     <i className="fa-solid fa-circle "></i>
          //                                   )}
          //                                   <div className="flex items-center gap-2">
          //                                     <p>Start Solving Issue : </p>
          //                                     {ticketDetails.solvingIssue ? (
          //                                       <p className="ml-2">
          //                                         {/* Format the assigned time */}
          //                                         {new Date(
          //                                           ticketDetails.solvingIssueTime
          //                                         ).toLocaleString(
          //                                           "en-US", // Change to desired locale
          //                                           {
          //                                             year: "numeric",
          //                                             month: "long",
          //                                             day: "numeric",
          //                                             hour: "numeric",
          //                                             minute: "numeric",
          //                                             hour12: true, // Set to false for 24-hour format
          //                                           }
          //                                         )}
          //                                       </p>
          //                                     ) : (
          //                                       <p>null</p>
          //                                     )}
          //                                   </div>
          //                                 </div>
          //                                 <div className="flex items-center gap-2 ml-2 mb-2">
          //                                   {ticketDetails.completedIssue ? (
          //                                     <i className="fa-solid fa-circle-check text-blue-500"></i>
          //                                   ) : (
          //                                     <i className="fa-solid fa-circle "></i>
          //                                   )}
          //                                   <div className="flex items-center gap-2  ">
          //                                     <p>
          //                                       Issue solved or completed :{" "}
          //                                     </p>
          //                                     {ticketDetails.completedIssue ? (
          //                                       <p className="ml-2 ">
          //                                         {/* Format the assigned time */}
          //                                         {new Date(
          //                                           ticketDetails.completedTime
          //                                         ).toLocaleString(
          //                                           "en-US", // Change to desired locale
          //                                           {
          //                                             year: "numeric",
          //                                             month: "long",
          //                                             day: "numeric",
          //                                             hour: "numeric",
          //                                             minute: "numeric",
          //                                             hour12: true, // Set to false for 24-hour format
          //                                           }
          //                                         )}
          //                                       </p>
          //                                     ) : (
          //                                       <p className="">null</p>
          //                                     )}
          //                                   </div>
          //                                 </div>
          //                               </div>
          //                             ) : (
          //                               <p>Loading ticket details...</p> // Loading state
          //                             )}
          //                           </div>
          //                         </div>
          //                       </TableCell>
          //                     </TableRow>
          //                   )}
          //                 </React.Fragment>
          //               ))
          //             ) : (
          //               <TableRow>
          //                 <TableCell
          //                   colSpan={columns.length}
          //                   className="h-24 text-center"
          //                 >
          //                   No results.
          //                 </TableCell>
          //               </TableRow>
          //             )}
          //           </TableBody>
          //         </Table>
          //       </div>
          //     </div>
          //   ) : (
          //     <ComAdminRequirementList />
          //   )}
          // </div>
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

export default IT_Admin_Executive;
