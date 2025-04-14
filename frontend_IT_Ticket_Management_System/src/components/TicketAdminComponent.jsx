import React, { useState, useEffect, useMemo } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, MoreHorizontal, Filter } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import * as XLSX from "xlsx";

import {
  getFormattedDate,
  getFormattedDateAndTime,
  getFormattedTime,
} from "@/utils/dateTimeUtils";

import ComAdminRequirementList from "./ComAdminRequirementListComponent";
import ItTable from "./ItTableComponent";
import useTicketStore from "@/store/useTicketStore";

function TicketAdmin({ allUsers, allTickets: data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [itAssignedView, setItAssignedView] = useState(false);
  const [itReAssignedView, setItReAssignedView] = useState(false);
  const [isOpenView, setIsOpenView] = useState(true);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [open, setOpen] = useState(false); // Track popover state

  const [selectedTicket, setSelectedTicket] = useState(null);
  const { updateTicket } = useTicketStore();

  const handlePriorityChange = async (data) => {
    try {
      await updateTicket(data);
      console.log("Priority updated ");
      window.location.reload();
    } catch (err) {
      console.error("Failed to update priority", err);
    }
  };

  const itUserDataMap = useMemo(() => {
    return allUsers.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});
  }, [allUsers]);

  const handleRowClickData = async (row) => {
    if (expandedRow === row.id) {
      setExpandedRow(null);
      setTicketDetails(null);
    } else {
      const details = data.find((ticket) => ticket._id === row.original._id);
      setTicketDetails(details);
      setExpandedRow(row.id);
    }
  };

  const downloadExcel = () => {
    // Extract table data for export
    const tableData = table.getRowModel().rows.map((row) => {
      console.log("Row Data:", row.original); // Debugging log

      return {
        "Full Name": `${row.original.fullname?.firstname || ""} ${
          row.original.fullname?.lastname || ""
        }`,
        Email: row.original.email || "N/A",
        "Assigned Time": row.original.assignedAt
          ? getFormattedDateAndTime(row.original.assignedAt)
          : "N/A",
        "Start Working": row.original.startToTicket
          ? getFormattedDateAndTime(row.original.startWorkingOnTicketIssueTime)
          : "N/A",
        "Reached Address": row.original.reachIssueAddress
          ? getFormattedDateAndTime(row.original.reachAddressIssueTime)
          : "N/A",
        "Started Solving": row.original.solvingIssue
          ? getFormattedDateAndTime(row.original.solvingIssueTime)
          : "N/A",
        "Completed Issue": row.original.completedIssue
          ? getFormattedDateAndTime(row.original.completedTime)
          : "N/A",
        "User Issue Reason": row.original.userIssueReasonDetail || "N/A",
      };
    });

    // Create a new workbook and add the data
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

    // Save the file
    XLSX.writeFile(workbook, "tickets_data.xlsx");
  };

  const columns = [
    {
      accessorKey: "issueDetail",
      meta: { label: "Title" },
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>Title</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <Input
                  placeholder="Filter titles..."
                  value={column.getFilterValue() || ""}
                  onChange={(e) => column.setFilterValue(e.target.value)}
                  className="max-w-sm mb-2"
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("issueDetail")}</div>
      ),
    },
    {
      accessorKey: "urgent",
      meta: { label: "Priority" },
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>Priority</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => column.setFilterValue(undefined)}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("normal")}
                >
                  Normal
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("moderate")}
                >
                  Moderate
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("urgent")}
                >
                  Urgent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      cell: ({ row }) => {
        const priority = row.getValue("urgent");
        const ticketId = row.original._id; // Get the ticket ID from the row data

        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div
                className={`capitalize cursor-pointer ${
                  priority === "urgent"
                    ? "text-red-500 font-semibold"
                    : priority === "moderate"
                    ? "text-yellow-500 font-semibold"
                    : "text-green-600"
                }`}
              >
                {priority}
              </div>
            </HoverCardTrigger>

            <HoverCardContent className="w-48 space-y-1" asChild>
              <div className="w-full">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Change Priority
                </div>
                {["normal", "moderate", "urgent"].map((level) => (
                  <Button
                    key={level}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left capitalize"
                    onClick={(e) => {
                      handlePriorityChange({
                        ticketId,
                        urgent: level,
                      });
                    }}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      },
    },
    {
      accessorKey: "typeIssue",
      meta: { label: "Category" },
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>Category</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="max-h-[300px] overflow-y-auto"
              >
                <DropdownMenuItem
                  onClick={() => column.setFilterValue(undefined)}
                >
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    column.setFilterValue("Network / Connectivity")
                  }
                >
                  Network / Connectivity
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("Laptop")}
                >
                  Laptop
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("Desktop")}
                >
                  Desktop
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("Printer")}
                >
                  Printer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("CCTV Camera")}
                >
                  CCTV Camera
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("Software Issue")}
                >
                  Software Issue
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("Cloud Service Issue")}
                >
                  Cloud Service Issue
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    column.setFilterValue("Email & Communication Issue")
                  }
                >
                  Email & Communication Issue
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    column.setFilterValue("User Account & Access Issue")
                  }
                >
                  User Account & Access Issue
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("IT Support Services")}
                >
                  IT Support Services
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    column.setFilterValue("Backup & Recovery Issues")
                  }
                >
                  Backup & Recovery Issues
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("typeIssue")}</div>
      ),
    },
    {
      accessorKey: "submissionTime",
      meta: { label: "Ticket Raised Time" },
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <span className="">Ticket Raised Time</span>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Filter className="h-4 w-4" />
                {/* {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                    : "Select date range"}
                 */}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto p-2 bg-white shadow-lg rounded-lg"
            >
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(newRange) => {
                  setDateRange(newRange);
                  let endDate = newRange?.to
                    ? new Date(newRange.to)
                    : undefined;
                  if (endDate) endDate.setHours(23, 59, 59, 999);

                  column.setFilterValue(
                    newRange?.from && endDate
                      ? [newRange.from, endDate]
                      : undefined
                  );
                }}
                initialFocus
              />
              <div className="flex justify-between">
                <Button onClick={() => setDateRange(undefined)}>
                  Clear Filter
                </Button>
                <Button onClick={() => setOpen(false)}> Close</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-gray-600">
          {format(new Date(row.getValue("submissionTime")), "MMM dd, yyyy")} at{" "}
          {format(new Date(row.getValue("submissionTime")), "hh:mm a")}
        </div>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue || !filterValue.length) return true;
        const rowDate = new Date(row.getValue(columnId));
        const [start, end] = filterValue;
        return rowDate >= start && rowDate <= end;
      },
    },
    {
      accessorKey: "acceptedTicketByUserId",
      meta: { label: "Assigned to" },
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>Assigned to</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => column.setFilterValue(undefined)}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("")}>
                  No Assign
                </DropdownMenuItem>
                {allUsers
                  .filter((user) => user.role === "it-team")
                  .map((user) => (
                    <DropdownMenuItem
                      key={user._id}
                      onClick={() => column.setFilterValue(user._id)}
                    >
                      {user.fullname?.firstname} {user.fullname?.lastname}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      cell: ({ row }) => {
        const assignedUserId = row.getValue("acceptedTicketByUserId");
        const assignedUser = itUserDataMap[assignedUserId];

        return assignedUserId ? (
          <div className="">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button className="text-orange-400" variant="link">
                  {assignedUser?.fullname?.firstname || "Unknown User"}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={assignedUser?.userImage || "/default-avatar.png"}
                    />
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">
                      {assignedUser?.fullname?.firstname}{" "}
                      {assignedUser?.fullname?.lastname}
                    </h4>
                    <p className="text-sm">{assignedUser?.email}</p>
                    <div className="flex items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        Role: {assignedUser?.role}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedTicket(row.original);
                          setItReAssignedView(true);
                        }}
                        className="bg-transparent text-red-400"
                      >
                        Re-Assign
                      </Button>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <Dialog open={itReAssignedView} onOpenChange={setItReAssignedView}>
              <DialogContent className="max-w-[1000px]">
                <DialogHeader>
                  <DialogTitle>Re-Assign To IT Member</DialogTitle>
                </DialogHeader>
                {itReAssignedView && (
                  <ItTable
                    itrole={"it-team"}
                    itReAssignedView={itReAssignedView}
                    ticketDataOfRow={selectedTicket}
                    allUsers={allUsers}
                    allTickets={data}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Dialog open={itAssignedView} onOpenChange={setItAssignedView}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setItAssignedView(true);
                }}
                className="border-none bg-transparent text-red-400"
              >
                No Assign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[1000px]">
              <DialogHeader>
                <DialogTitle>Assign To IT Member</DialogTitle>
              </DialogHeader>
              {itAssignedView && (
                <ItTable
                  itrole={"it-team"}
                  itAssignedView={itAssignedView}
                  ticketDataOfRow={row.original}
                  allUsers={allUsers}
                  allTickets={data}
                />
              )}
            </DialogContent>
          </Dialog>
        );
      },
    },
    {
      accessorKey: "status",
      meta: { label: "Status" },
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>Status</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => column.setFilterValue(undefined)}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("Pending")}
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("In Progress")}
                >
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("Resolving")}
                >
                  Resolving
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => column.setFilterValue("Completed")}
                >
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      cell: ({ row }) => {
        const [selectedFilters, setSelectedFilters] = useState({
          assigned: "false",
          startToTicket: "false",
          reachIssueAddress: "false",
          solvingIssue: "false",
          resolvingIssue: "false",
          completedIssue: "false",
        });

        // Fetch ticket details when the component mounts
        useEffect(() => {
          const fetchTicketDetails = async () => {
            if (row.original.acceptedTicketByUserId) {
              try {
                const ticketData = data.find(
                  (ticket) =>
                    ticket.acceptedTicketByUserId ===
                    row.original.acceptedTicketByUserId
                );

                setSelectedFilters((prev) => ({
                  ...prev,
                  assigned: ticketData?.assigned ? "true" : "false",
                  startToTicket: ticketData?.startToTicket ? "true" : "false",
                  reachIssueAddress: ticketData?.reachIssueAddress
                    ? "true"
                    : "false",
                  solvingIssue: ticketData?.solvingIssue ? "true" : "false",
                  resolvingIssue: ticketData?.resolvingIssue ? "true" : "false",
                  completedIssue: ticketData?.completedIssue ? "true" : "false",
                }));
              } catch (error) {
                console.error("Error fetching ticket details:", error);
              }
            }
          };

          fetchTicketDetails();
        }, [row.original.acceptedTicketByUserId, data]); //Fixed dependency

        // Determine status based on selectedFilters
        let status = "----";
        if (
          selectedFilters.assigned === "true" &&
          selectedFilters.completedIssue === "false"
        ) {
          if (selectedFilters.startToTicket === "false") {
            status = "Pending";
          } else if (selectedFilters.resolvingIssue === "true") {
            status = "Resolving";
          } else {
            status = "In Progress";
          }
        } else if (selectedFilters.completedIssue === "true") {
          status = "Completed";
        }

        // Set color based on status
        const statusColor =
          status === "Pending"
            ? "text-red-400"
            : status === "In Progress"
            ? "text-blue-400"
            : status === "Resolving"
            ? "text-purple-400"
            : status === "Completed"
            ? "text-green-400"
            : "text-red-400";

        return <div className={statusColor}>{status}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
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

      const filterValueLower = String(filterValue).toLowerCase();

      return columnsToFilter.some((columnId) => {
        const value = row.getValue(columnId);
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
    <div className="w-full">
      <div className="w-full bg-white rounded-t-lg shadow-sm p-1">
        <div className="flex gap-1 items-center">
          {/* Issue Tickets Tab */}
          <button
            className={`flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${
              isOpenView
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpenView(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            Issue Tickets
          </button>

          {/* Requirement Tickets Tab */}
          <button
            className={`flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${
              !isOpenView
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
            onClick={() => setIsOpenView(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Requirement Tickets
          </button>
        </div>
      </div>
      {isOpenView ? (
        <div className="w-full px-10 py-2">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter tickets..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
            <Button
              onClick={downloadExcel}
              className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Download Tickets
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.columnDef.meta?.label || column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-slate-200">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() ? "selected" : ""}
                        className={row.getIsSelected() ? "bg-blue-100" : ""}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {expandedRow === row.id && (
                        <TableRow
                          data-state={row.getIsSelected() ? "selected" : ""}
                          className={row.getIsSelected() ? "bg-blue-100" : ""}
                        >
                          <TableCell colSpan={columns.length}>
                            <div className="p-4">
                              <h4 className="font-semibold text-2xl mb-2">
                                Ticket Detail
                              </h4>
                              <div>
                                <div className="grid gap-4">
                                  <div className="border rounded-sm">
                                    <h2 className="text-xl ml-2 mt-2">
                                      Ticket Raised By :-
                                    </h2>
                                    <p className="ml-2">
                                      Name: {row.original.fullname?.firstname}{" "}
                                      {row.original.fullname?.lastname}
                                    </p>
                                    <p className="ml-2 mb-2">
                                      Email: {row.original.email}
                                    </p>
                                  </div>
                                </div>
                                {ticketDetails ? (
                                  <div className="border rounded-sm">
                                    <h2 className="text-xl ml-2 mt-2">
                                      Ticket History
                                    </h2>
                                    <div className="flex items-center gap-2 ml-2">
                                      {ticketDetails.assigned ? (
                                        <i className="fa-solid fa-circle-check text-blue-500"></i>
                                      ) : (
                                        <i className="fa-solid fa-circle"></i>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <p>Ticket assigned : </p>
                                        {ticketDetails.assigned ? (
                                          <p className="ml-2">
                                            {new Date(
                                              ticketDetails.assignedAt
                                            ).toLocaleString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                              hour: "numeric",
                                              minute: "numeric",
                                              hour12: true,
                                            })}
                                          </p>
                                        ) : (
                                          <p>null</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2">
                                      {ticketDetails.startToTicket ? (
                                        <i className="fa-solid fa-circle-check text-blue-500"></i>
                                      ) : (
                                        <i className="fa-solid fa-circle"></i>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <p>Initiated : </p>
                                        {ticketDetails.startToTicket ? (
                                          <p className="ml-2">
                                            {new Date(
                                              ticketDetails.startWorkingOnTicketIssueTime
                                            ).toLocaleString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                              hour: "numeric",
                                              minute: "numeric",
                                              hour12: true,
                                            })}
                                          </p>
                                        ) : (
                                          <p>null</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2">
                                      {ticketDetails.reachIssueAddress ? (
                                        <i className="fa-solid fa-circle-check text-blue-500"></i>
                                      ) : (
                                        <i className="fa-solid fa-circle"></i>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <p>Reach Issue Address : </p>
                                        {ticketDetails.reachIssueAddress ? (
                                          <p className="ml-2">
                                            {new Date(
                                              ticketDetails.reachAddressIssueTime
                                            ).toLocaleString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                              hour: "numeric",
                                              minute: "numeric",
                                              hour12: true,
                                            })}
                                          </p>
                                        ) : (
                                          <p>null</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2">
                                      {ticketDetails.solvingIssue ? (
                                        <i className="fa-solid fa-circle-check text-blue-500"></i>
                                      ) : (
                                        <i className="fa-solid fa-circle"></i>
                                      )}
                                      <div className="flex items-center gap-2">
                                        <p>Start Solving Issue : </p>
                                        {ticketDetails.solvingIssue ? (
                                          <p className="ml-2">
                                            {new Date(
                                              ticketDetails.solvingIssueTime
                                            ).toLocaleString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                              hour: "numeric",
                                              minute: "numeric",
                                              hour12: true,
                                            })}
                                          </p>
                                        ) : (
                                          <p>null</p>
                                        )}
                                      </div>
                                    </div>
                                    {ticketDetails.userIssueReason && (
                                      <div className="mx-2">
                                        <div className="ml-2 p-2 rounded-sm border bg-red-200">
                                          <h2 className="font-bold">
                                            User reason for Resolve the Issue :-
                                          </h2>
                                          <p className="px-1 text-sm">
                                            {
                                              ticketDetails.userIssueReasonDetail
                                            }
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2 ">
                                          {ticketDetails.resolvingIssue ? (
                                            <i className="fa-solid fa-circle-check text-blue-500"></i>
                                          ) : (
                                            <i className="fa-solid fa-circle "></i>
                                          )}
                                          <div className="flex items-center gap-2">
                                            <p>Start Resolving Issue : </p>
                                            {ticketDetails.resolvingIssue ? (
                                              <p className="ml-2">
                                                {new Date(
                                                  ticketDetails.resolvingIssueTime
                                                ).toLocaleString("en-US", {
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                                  hour: "numeric",
                                                  minute: "numeric",
                                                  hour12: true,
                                                })}
                                              </p>
                                            ) : (
                                              <p>null</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2 ml-2 mb-2">
                                      {ticketDetails.completedIssue ? (
                                        <i className="fa-solid fa-circle-check text-blue-500"></i>
                                      ) : (
                                        <i className="fa-solid fa-circle "></i>
                                      )}
                                      <div className="flex items-center gap-2  ">
                                        <p>Issue solved or completed : </p>
                                        {ticketDetails.completedIssue ? (
                                          <p className="ml-2 ">
                                            {new Date(
                                              ticketDetails.completedTime
                                            ).toLocaleString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                              hour: "numeric",
                                              minute: "numeric",
                                              hour12: true,
                                            })}
                                          </p>
                                        ) : (
                                          <p className="">null</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p>Loading ticket details...</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4 px-5">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <ComAdminRequirementList />
      )}
    </div>
  );
}

export default TicketAdmin;
