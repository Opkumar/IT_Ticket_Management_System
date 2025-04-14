import React, { useState, useEffect, useMemo } from "react";
import { startOfDay, isSameDay, format } from "date-fns"; // Add this import to format dates
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/useAuthStore";
import useTicketStore from "@/store/useTicketStore";

const ItTable = ({
  itrole,
  itAssignedView,
  itReAssignedView,
  ticketDataOfRow,
  allUsers,
  allTickets,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const { updateUser } = useAuthStore();
  const { updateTicket } = useTicketStore();
  // console.log(ticketDataOfRow.acceptedTicketByUserId)

  const data = useMemo(() => {
    return allUsers.filter((user) => user.role === itrole);
  }, [allUsers, itrole]); // Recompute only when allUsers or itrole changes

  // useEffect(() => {
  //   const fetchAcceptedTickets = async () => {
  //     try {
  //       const today = format(new Date(), "dd/MM/yyyy");

  //       const updatedUsers = allUsers.map((user) => {
  //         let todayAcceptedTickets = 0;
  //         let todayCompletedTickets = 0;
  //         let totalAcceptedTickets = 0;
  //         let totalCompletedTickets = 0;

  //         allTickets
  //           .filter((ticket) => ticket.acceptedTicketByUserId === user._id)
  //           .forEach((ticket) => {
  //             if (!ticket.assignedAt) return; // Skip if no assignedTime

  //             const assignedDate = new Date(ticket.assignedAt);
  //             if (isNaN(assignedDate.getTime())) return; // Skip if invalid date

  //             const ticketDate = format(assignedDate, "dd/MM/yyyy");

  //             if (ticket.assigned && ticketDate === today) {
  //               todayAcceptedTickets++;
  //             }
  //             if (ticket.completedIssue && ticketDate === today) {
  //               todayCompletedTickets++;
  //             }
  //           });

  //         return {
  //           ...user,
  //           todayAcceptedTickets,
  //           todayCompletedTickets,
  //         };
  //       });

  //       await Promise.all(
  //         updatedUsers.map((user) =>
  //           updateUser({
  //             userId: user._id,
  //             todayAcceptedTickets: user.todayAcceptedTickets,
  //             todayCompletedTickets: user.todayCompletedTickets,
  //           })
  //         )
  //       );
  //     } catch (error) {
  //       console.error("Error fetching accepted tickets: ", error);
  //     }
  //   };

  //   fetchAcceptedTickets();
  // }, []);
  useEffect(() => {
    const fetchAcceptedTickets = async () => {
      try {
        const today = format(new Date(), "dd/MM/yyyy");
  
        const updatedUsers = allUsers.map((user) => {
          let todayAcceptedTickets = 0;
          let todayCompletedTickets = 0;
          let totalAcceptedTickets = 0;
          let totalCompletedTickets = 0;
  
          allTickets
            .filter((ticket) => ticket.acceptedTicketByUserId === user._id)
            .forEach((ticket) => {
              if (!ticket.assignedAt) return;
  
              const assignedDate = new Date(ticket.assignedAt);
              if (isNaN(assignedDate.getTime())) return;
  
              const ticketDate = format(assignedDate, "dd/MM/yyyy");
  
              // Count today's accepted tickets
              if (ticket.assigned && ticketDate === today) {
                todayAcceptedTickets++;
              }
  
              // Count today's completed tickets
              if (ticket.completedIssue && ticketDate === today) {
                todayCompletedTickets++;
              }
  
              // Count total accepted tickets
              if (ticket.assigned) {
                totalAcceptedTickets++;
              }
  
              // Count total completed tickets
              if (ticket.completedIssue) {
                totalCompletedTickets++;
              }
            });
  
          return {
            ...user,
            todayAcceptedTickets,
            todayCompletedTickets,
            totalAcceptedTickets,
            totalCompletedTickets,
          };
        });
  
        await Promise.all(
          updatedUsers.map((user) =>
            updateUser({
              userId: user._id,
              todayAcceptedTickets: user.todayAcceptedTickets,
              todayCompletedTickets: user.todayCompletedTickets,
              totalAcceptedTickets: user.totalAcceptedTickets,
              totalCompletedTickets: user.totalCompletedTickets,
            })
          )
        );
      } catch (error) {
        console.error("Error fetching accepted tickets: ", error);
      }
    };
  
    fetchAcceptedTickets();
  }, [allTickets]);
  
  const assignTicket = async (userId) => {
    try {
      const today = startOfDay(new Date()); // Get today's date at midnight

      // Filter and count tickets based on the assigned and completed status
      const todayAcceptedTickets = allTickets.filter(
        (ticket) =>
          ticket.acceptedTicketByUserId === userId &&
          ticket.assigned &&
          isSameDay(new Date(ticket.assignedAt), today)
      );

      const todayCompletedTickets = allTickets.filter(
        (ticket) =>
          ticket.acceptedTicketByUserId === userId &&
          ticket.completedIssue &&
          isSameDay(new Date(ticket.completedTime), today)
      );

      // Update the user's stats in the database
      await updateUser({
        userId,
        todayAcceptedTickets: todayAcceptedTickets.length,
        todayCompletedTickets: todayCompletedTickets.length,
      });

      // Assign the new ticket
      await updateTicket({
        ticketId: ticketDataOfRow._id,
        acceptedTicketByUserId: userId,
        assigned: true,
        assignedAt: Date.now(),
      });

      console.log("Successfully assigned the ticket");
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };
  const reAssignTicket = async (userId) => {
    try {
      const today = startOfDay(new Date()); // Get today's date at midnight

      // Filter and count tickets based on the assigned and completed status
      const todayAcceptedTickets = allTickets.filter(
        (ticket) =>
          ticket.acceptedTicketByUserId === userId &&
          ticket.assigned &&
          isSameDay(new Date(ticket.assignedAt), today)
      );

      const todayCompletedTickets = allTickets.filter(
        (ticket) =>
          ticket.acceptedTicketByUserId === userId &&
          ticket.completedIssue &&
          isSameDay(new Date(ticket.completedTime), today)
      );

      // Update the user's stats in the database
      await updateUser({
        userId,
        todayAcceptedTickets: todayAcceptedTickets.length,
        todayCompletedTickets: todayCompletedTickets.length,
      });

      // Assign the new ticket
      await updateTicket({
        ticketId: ticketDataOfRow._id,
        acceptedTicketByUserId: userId,
        assigned: true,
        assignedAt: Date.now(),
        startWorkingOnTicketIssueTime: null,
        reachAddressIssueTime: null,
        solvingIssueTime: null,
        completedTime: null,
        startToTicket: false,
        reachIssueAddress: false,
        solvingIssue: false,
        completedIssueByIt: false,
        completedIssue: false,
        userIssueReason: false,
        resolvingIssue: false,
        userIssueReasonDetail: null,
        resolvingIssueTime: null,
        completedIssueByItTime: null,
      });

      console.log("Successfully re-assigned the ticket");
      window.location.reload();
    } catch (error) {
      console.error("Error re-assigning ticket:", error);
    }
  };

  const columns = [
    {
      id: "select",
      header: "NO.",
      cell: ({ row }) => <p>{parseInt(row.id) + 1}</p>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "fullname",
      accessorKey: "fullname",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("fullname")?.firstname}{" "}
          {row.getValue("fullname")?.lastname}
        </div>
      ),
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="ml-2 flex items-center"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    itrole === "it-team" && {
      id: "todayAcceptedTickets",
      accessorKey: "todayAcceptedTickets",
      header: itrole === "it-team" ? "Today No. Of Assigned" : null,
      cell: ({ row }) => (
        <div className="font-medium cursor-pointer flex">
          <p className="text-green-400 pr-2">
            {row.original.todayCompletedTickets}
          </p>{" "}
          /
          <p className="text-red-400 pl-2">
            {row.original.todayAcceptedTickets}
          </p>
        </div>
      ),
    },
    itrole === "it-team" && {
      id: "todayAcceptedTickets",
      accessorKey: "todayAcceptedTickets",
      header: itrole === "it-team" ? " Total No. Of Assigned" : null,
      cell: ({ row }) => (
        <div className="font-medium cursor-pointer flex">
          <p className="text-green-400 pr-2">
            {row.original.totalCompletedTickets}
          </p>{" "}
          /
          <p className="text-red-400 pl-2">
            {row.original.totalAcceptedTickets}
          </p>
        </div>
      ),
    },
    itAssignedView && {
      id: "assignButton",
      accessorKey: "assignButton",
      header: itrole === "it-team" ? "Assign To" : null,
      cell: ({ row }) => (
        <div className="font-medium">
          <button
            className="bg-gray-300 py-1 px-3 rounded-sm"
            onClick={() => assignTicket(row.original._id)} // Assign the ticket
          >
            Assign
          </button>
        </div>
      ),
    },
    itReAssignedView && {
      id: "assignButton",
      accessorKey: "assignButton",
      header: itrole === "it-team" ? "Re-Assign To" : null,
      cell: ({ row }) => {
        const rowId = row.original._id;
        const isAssignedToSelf = ticketDataOfRow.acceptedTicketByUserId === rowId;
        return(
        <div className="font-medium">
          {!isAssignedToSelf?(<button
            className="bg-gray-300 py-1 px-3 rounded-sm"
            onClick={() => reAssignTicket(row.original._id)} // Assign the ticket
          >
            Re-Assign
          </button>):(
            <p className="text-gray-400">Assigned</p>
          )}
        </div>
      )},
    },
    itrole === "faculty" && {
      id: "role",
      accessorKey: "role",
      header: "Change Role",
      cell: ({ row }) => {
        const [selectedVenue, setSelectedVenue] = useState("");

        const changeUserRole = async (userRole) => {
          if (row.original._id) {
            await updateUser({
              userId: row.original._id,
              role: userRole,
              userVenue: selectedVenue, // Now correctly stores venue selection
            });
            window.location.reload();
          }
        };

        return (
          <div className="font-medium">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-500 hover:bg-orange-100"
                >
                  Change Role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-6 rounded-xl">
                <DialogHeader className="text-center">
                  <DialogTitle className="text-xl font-semibold text-gray-800">
                    Change Role
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">
                    Modify the user profile and assign roles here.
                  </DialogDescription>
                </DialogHeader>

                {/* User Info Section */}
                <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                  <img
                    className="w-14 h-14 rounded-full border border-gray-300"
                    src={
                      row.original.userImage ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="User Avatar"
                  />
                  <div className="text-gray-700">
                    <h2 className="text-lg font-semibold">
                      {row.original.fullname?.firstname}{" "}
                      {row.original.fullname?.lastname}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {row.original.email}
                    </p>
                    <p className="text-sm font-medium">
                      Role:{" "}
                      <span className="text-orange-500">
                        {row.original.role}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Venue Selection */}
                <div className="mt-4">
                  <p className="font-medium text-gray-700">
                    Select Specific Venue:
                  </p>
                  <div className="flex gap-3 mt-2">
                    {["Block A", "Block B", "Block C"].map((block) => (
                      <Label
                        key={block}
                        className="flex items-center gap-2 cursor-pointer text-gray-600"
                      >
                        <input
                          type="radio"
                          name="venue"
                          value={block}
                          className="accent-orange-500"
                          checked={selectedVenue === block}
                          onChange={(e) => setSelectedVenue(e.target.value)}
                        />
                        {block}
                      </Label>
                    ))}
                  </div>
                </div>

                {/* Role Change Section */}
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-md font-semibold text-gray-700">
                    Convert Into IT Member:
                  </p>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => changeUserRole("it-team")}
                    disabled={!selectedVenue} // Disable if no venue is selected
                  >
                    Submit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ].filter(Boolean);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto flex items-center">
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-200">
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const rowId = row.original._id;
                const isAssignedToSelf = ticketDataOfRow?.acceptedTicketByUserId === rowId;
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className={isAssignedToSelf ? "bg-orange-50 text-gray-400" : ""}
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
                );
              })
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

        {/* <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
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
        </Table> */}
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
    </div>
  );
};

export default ItTable;
