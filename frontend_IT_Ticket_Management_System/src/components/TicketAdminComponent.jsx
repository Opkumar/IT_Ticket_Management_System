import React from "react";
import { useState, useEffect, useMemo } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, MoreHorizontal, Filter, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from "xlsx";
import { getFormattedDateAndTime } from "@/utils/dateTimeUtils";
import ComAdminRequirementList from "./ComAdminRequirementListComponent";
import ItTable from "./ItTableComponent";
import useTicketStore from "@/store/useTicketStore";

export default function TicketAdmin({ allUsers, allTickets: data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [itAssignedView, setItAssignedView] = useState(false);
  const [itReAssignedView, setItReAssignedView] = useState(false);
  const [activeTab, setActiveTab] = useState("issues");
  const [ticketDetails, setTicketDetails] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { updateTicket } = useTicketStore();
  const [selectedFilters, setSelectedFilters] = useState({
    assigned: "false",
    startToTicket: "false",
    reachIssueAddress: "false",
    solvingIssue: "false",
    resolvingIssue: "false",
    completedIssue: "false",
  });
  const [open, setOpen] = useState(false);

  const handlePriorityChange = async (data) => {
    try {
      await updateTicket(data);
      console.log("Priority updated");
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
      header: ({ column }) => (
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
      ),
      cell: ({ row }) => {
        const assignedUserId = row.getValue("acceptedTicketByUserId");
        const assignedUser = itUserDataMap[assignedUserId];

        return assignedUserId ? (
          <>
            <Button
              className="text-orange-400 px-0 md:px-2 text-sm md:text-base"
              variant="link"
              onClick={() => setItReAssignedView(true)}
            >
              {assignedUser?.fullname?.firstname || "Unknown User"}
            </Button>

            {/* Mobile and Desktop Re-Assign Dialog */}
            <Dialog open={itReAssignedView} onOpenChange={setItReAssignedView}>
              <DialogContent className="w-full max-w-[95vw] md:max-w-[900px]">
                <DialogHeader>
                  <DialogTitle>Re-Assign To IT Member</DialogTitle>
                </DialogHeader>
                {itReAssignedView && (
                  <div className="overflow-auto max-h-[75vh]">
                    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={assignedUser?.userImage || "/default-avatar.png"}
                        />
                      </Avatar>
                      <div className="text-sm space-y-1">
                        <div className="font-semibold">
                          {assignedUser?.fullname?.firstname}{" "}
                          {assignedUser?.fullname?.lastname}
                        </div>
                        <div>{assignedUser?.email}</div>
                        <div className="text-xs text-muted-foreground">
                          Role: {assignedUser?.role}
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <ItTable
                        itrole="it-team"
                        itReAssignedView={itReAssignedView}
                        ticketDataOfRow={row.original}
                        allUsers={allUsers}
                        allTickets={data}
                      />
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setItAssignedView(true)}
              className="bg-transparent text-red-400 text-sm md:text-base border-none"
            >
              No Assign
            </Button>

            <Dialog open={itAssignedView} onOpenChange={setItAssignedView}>
              <DialogTrigger asChild></DialogTrigger>
              <DialogContent className="w-full max-w-[95vw] md:max-w-[900px]">
                <DialogHeader>
                  <DialogTitle>Assign To IT Member</DialogTitle>
                </DialogHeader>
                {itAssignedView && (
                  <div className="overflow-auto max-h-[75vh]">
                    <ItTable
                      itrole="it-team"
                      itAssignedView={itAssignedView}
                      ticketDataOfRow={row.original}
                      allUsers={allUsers}
                      allTickets={data}
                    />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
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
      <Tabs
        defaultValue="issues"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
          </TabsTrigger>
          <TabsTrigger value="requirements" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-4">
            <Input
              placeholder="Filter tickets..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={downloadExcel}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download Tickets</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-auto">
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
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-slate-100">
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
                          className={row.getIsSelected() ? "bg-blue-50" : ""}
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
                            className={
                              row.getIsSelected() ? "bg-blue-50" : "bg-gray-50"
                            }
                          >
                            <TableCell colSpan={columns.length}>
                              <Card>
                                <CardContent className="p-4">
                                  <h4 className="font-semibold text-xl mb-4">
                                    Ticket Detail
                                  </h4>
                                  <div className="space-y-4">
                                    <div className="border rounded-md p-3 bg-white">
                                      <h2 className="text-lg font-medium">
                                        Ticket Raised By:
                                      </h2>
                                      <p>
                                        <span className="font-medium">
                                          Name:
                                        </span>{" "}
                                        {row.original.fullname?.firstname}{" "}
                                        {row.original.fullname?.lastname}
                                      </p>
                                      <p>
                                        <span className="font-medium">
                                          Email:
                                        </span>{" "}
                                        {row.original.email}
                                      </p>
                                    </div>

                                    {ticketDetails ? (
                                      <div className="border rounded-md p-3 bg-white">
                                        <h2 className="text-lg font-medium mb-2">
                                          Ticket History
                                        </h2>
                                        <ScrollArea className="h-[300px] md:h-auto md:max-h-[400px]">
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                              {ticketDetails.assigned ? (
                                                <div className="h-4 w-4 rounded-full bg-blue-500" />
                                              ) : (
                                                <div className="h-4 w-4 rounded-full border border-gray-300" />
                                              )}
                                              <div>
                                                <p className="font-medium">
                                                  Ticket assigned:
                                                </p>
                                                {ticketDetails.assigned ? (
                                                  <p className="text-sm text-gray-600">
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
                                                  <p className="text-sm text-gray-500">
                                                    Not assigned
                                                  </p>
                                                )}
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                              {ticketDetails.startToTicket ? (
                                                <div className="h-4 w-4 rounded-full bg-blue-500" />
                                              ) : (
                                                <div className="h-4 w-4 rounded-full border border-gray-300" />
                                              )}
                                              <div>
                                                <p className="font-medium">
                                                  Initiated:
                                                </p>
                                                {ticketDetails.startToTicket ? (
                                                  <p className="text-sm text-gray-600">
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
                                                  <p className="text-sm text-gray-500">
                                                    Not started
                                                  </p>
                                                )}
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                              {ticketDetails.reachIssueAddress ? (
                                                <div className="h-4 w-4 rounded-full bg-blue-500" />
                                              ) : (
                                                <div className="h-4 w-4 rounded-full border border-gray-300" />
                                              )}
                                              <div>
                                                <p className="font-medium">
                                                  Reached Issue Address:
                                                </p>
                                                {ticketDetails.reachIssueAddress ? (
                                                  <p className="text-sm text-gray-600">
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
                                                  <p className="text-sm text-gray-500">
                                                    Not reached
                                                  </p>
                                                )}
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                              {ticketDetails.solvingIssue ? (
                                                <div className="h-4 w-4 rounded-full bg-blue-500" />
                                              ) : (
                                                <div className="h-4 w-4 rounded-full border border-gray-300" />
                                              )}
                                              <div>
                                                <p className="font-medium">
                                                  Started Solving Issue:
                                                </p>
                                                {ticketDetails.solvingIssue ? (
                                                  <p className="text-sm text-gray-600">
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
                                                  <p className="text-sm text-gray-500">
                                                    Not started solving
                                                  </p>
                                                )}
                                              </div>
                                            </div>

                                            {ticketDetails.userIssueReason && (
                                              <div className="mt-2 p-3 rounded-md bg-red-50 border border-red-200">
                                                <h3 className="font-semibold">
                                                  User reason for Resolving the
                                                  Issue:
                                                </h3>
                                                <p className="text-sm mt-1">
                                                  {
                                                    ticketDetails.userIssueReasonDetail
                                                  }
                                                </p>

                                                <div className="flex items-center gap-2 mt-2">
                                                  {ticketDetails.resolvingIssue ? (
                                                    <div className="h-4 w-4 rounded-full bg-blue-500" />
                                                  ) : (
                                                    <div className="h-4 w-4 rounded-full border border-gray-300" />
                                                  )}
                                                  <div>
                                                    <p className="font-medium">
                                                      Started Resolving Issue:
                                                    </p>
                                                    {ticketDetails.resolvingIssue ? (
                                                      <p className="text-sm text-gray-600">
                                                        {new Date(
                                                          ticketDetails.resolvingIssueTime
                                                        ).toLocaleString(
                                                          "en-US",
                                                          {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "numeric",
                                                            minute: "numeric",
                                                            hour12: true,
                                                          }
                                                        )}
                                                      </p>
                                                    ) : (
                                                      <p className="text-sm text-gray-500">
                                                        Not started resolving
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            <div className="flex items-center gap-2">
                                              {ticketDetails.completedIssue ? (
                                                <div className="h-4 w-4 rounded-full bg-blue-500" />
                                              ) : (
                                                <div className="h-4 w-4 rounded-full border border-gray-300" />
                                              )}
                                              <div>
                                                <p className="font-medium">
                                                  Issue solved or completed:
                                                </p>
                                                {ticketDetails.completedIssue ? (
                                                  <p className="text-sm text-gray-600">
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
                                                  <p className="text-sm text-gray-500">
                                                    Not completed
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </ScrollArea>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center h-20">
                                        <p>Loading ticket details...</p>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
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
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-4">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-2">
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
        </TabsContent>

        <TabsContent value="requirements">
          <ComAdminRequirementList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
