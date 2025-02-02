import React, { useState, useEffect } from "react";
import { db } from "../../config/firebaseConfig"; // Your Firebase config
import { ref, get, set, update, serverTimestamp } from "firebase/database"; // Import Realtime Database functions
import { getAuth, onAuthStateChanged } from "firebase/auth";
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

const ItTable = ({ itrole, ticketDataOfRow, itAssignedView }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const authUser = getAuth();
  const userlogin = authUser.currentUser;

  const [role, setRole] = useState(null);

  // console.log(userlogin);

  // Function to fetch user data
  const fetchData = async () => {
    try {
      const ticketRef = ref(db, "users");
      const snapshot = await get(ticketRef);
      const ticketList = [];
      snapshot.forEach((childSnapshot) => {
        const userData = childSnapshot.val();
        if (userData && userData.role === itrole) {
          // Calculate today's completed tickets
          const today = format(new Date(), "dd/MM/yyyy");
          const todayCompletedCount = Object.values(
            userData.acceptedTickets || {}
          ).filter(
            (ticket) => ticket.completedIssue && ticket.assignedTime === today
          ).length;

          ticketList.push({
            id: childSnapshot.key,
            todayCompletedTickets: todayCompletedCount,
            ...userData,
          });
        }
      });
      setData(ticketList);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      if (userlogin) {
        const roleRef = ref(db, `users/${userlogin.uid}/role`); // Adjust the path according to your structure
        const snapshot = await get(roleRef);
        if (snapshot.exists()) {
          setRole(snapshot.val());
        } else {
          console.log("No role data available");
        }
      }
      // setLoadings(false);
    };

    fetchUserRole();
  }, [userlogin]);
  // useEffect(() => {
  //   const updateTodayAssignedTickets = async () => {
  //    try {
  //     const today = startOfDay(new Date()); // Get today's date at midnight

  //     const todayAcceptedTicketsRef = ref(db, `users/${userId}/acceptedTickets`);
  //     const todayAcceptedTicketsSnapshot = await get(todayAcceptedTicketsRef);
  //     const todayAcceptedTickets = [];
  //     const todayCompletedTickets = [];

  //     todayAcceptedTicketsSnapshot.forEach((childSnapshot) => {
  //       const ticketData = childSnapshot.val();

  //       if (ticketData) {
  //         const assignedTime = new Date(ticketData.assignedTime); // Convert to Date object
  //         const completedTime = new Date(ticketData.completedTime); // Convert to Date object

  //         if (ticketData.assigned && isSameDay(assignedTime, today)) {
  //           todayAcceptedTickets.push(ticketData);
  //         }

  //         if (ticketData.completedIssue && isSameDay(completedTime, today)) {
  //           todayCompletedTickets.push(ticketData);
  //         }
  //       }
  //     });

  //     console.log(todayAcceptedTickets);

  //     // Update user's ticket count
  //     await update(ref(db, `users/${userId}`), {
  //       todayAcceptedTickets: todayAcceptedTickets.length,
  //       todayCompletedTickets: todayCompletedTickets.length,
  //     });

  //    } catch (error) {
  //     console.error("")

  //    }

  //   };

  //   updateTodayAssignedTickets();
  // }, [userlogin]);

  // Function to assign ticket to user
  const assignTicket = async (userId) => {
    if (!userId) {
      console.error("User ID is missing");
      return; // Ensure user ID is available
    }

    try {
      const assignedUserRef = ref(
        db,
        `users/${userId}/acceptedTickets/${ticketDataOfRow.id}`
      );
      const ticketRef = ref(db, `tickets/${ticketDataOfRow.id}`);

      // Set the assigned ticket information
      await set(assignedUserRef, {
        ticketId: ticketDataOfRow.id,
        typeIssue: ticketDataOfRow.typeIssue,
        issueImage: ticketDataOfRow.issueImage,
        issueDetail: ticketDataOfRow.issueDetail,
        issueAddress: ticketDataOfRow.issueAddress,
        urgent: ticketDataOfRow.urgent,
        submissionTime: ticketDataOfRow.submissionTime,
        assigned: true,
        assignedTime: Date.now(),
        startWorkingOnTicketIssueTime: null,
        reachAddressIssueTime: null,
        solvingIssueTime: null,
        completedTime: null,
        startToTicket: false,
        reachIssueAddress: false,
        solvingIssue: false,
        completedIssue: false,
      });

      // Update the user data
      // const today = format(new Date(), "dd/MM/yyyy");
      const today = startOfDay(new Date()); // Get today's date at midnight

      const todayAcceptedTicketsRef = ref(
        db,
        `users/${userId}/acceptedTickets`
      );
      const todayAcceptedTicketsSnapshot = await get(todayAcceptedTicketsRef);
      const todayAcceptedTickets = [];
      const todayCompletedTickets = [];

      todayAcceptedTicketsSnapshot.forEach((childSnapshot) => {
        const ticketData = childSnapshot.val();

        if (ticketData) {
          const assignedTime = new Date(ticketData.assignedTime); // Convert to Date object
          const completedTime = new Date(ticketData.completedTime); // Convert to Date object

          if (ticketData.assigned && isSameDay(assignedTime, today)) {
            todayAcceptedTickets.push(ticketData);
          }

          if (ticketData.completedIssue && isSameDay(completedTime, today)) {
            todayCompletedTickets.push(ticketData);
          }
        }
      });

      // console.log(todayAcceptedTickets);

      // Update user's ticket count
      await update(ref(db, `users/${userId}`), {
        todayAcceptedTickets: todayAcceptedTickets.length,
        todayCompletedTickets: todayCompletedTickets.length,
      });
      // Update the ticket to indicate it's been assigned
      await update(ticketRef, {
        acceptedTicketByUserId: userId,
        assigned: true,
        assignedAt: Date.now(),
      });

      // window.location.reload();
      console.log("Successfully assigned");
    } catch (error) {
      console.error("Error assigning ticket: ", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user)
        fetchData();
      } else {
        console.error("User is not authenticated");
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  useEffect(() => {
    fetchData(); // Fetch data when itrole changes
  }, [itrole]); // Depend on itrole

  const columns = [
    {
      id: "select",
      header: "NO.",
      cell: ({ row }) => <p>{parseInt(row.id) + 1}</p>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "fullName",
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fullName")}</div>
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
      header: itrole === "it-team" ? "No. Of Assigned Tickets" : null,
      cell: ({ row }) => {
        useEffect(() => {
          const fetchAcceptedTickets = async () => {
            try {
              const acceptedTicketsRef = ref(
                db,
                `users/${row.original.id}/acceptedTickets`
              );
              const today = format(new Date(), "dd/MM/yyyy");
              const snapshot = await get(acceptedTicketsRef);

              if (snapshot.exists()) {
                let todayAcceptedTickets = 0;
                let todayCompletedTickets = 0;

                snapshot.forEach((doc) => {
                  const ticketData = doc.val();
                  const ticketDate = format(
                    ticketData.assignedTime,
                    "dd/MM/yyyy"
                  );

                  if (
                    ticketData.completedIssue === false &&
                    ticketDate === today
                  ) {
                    todayAcceptedTickets++;
                  }
                  if (
                    ticketData.completedIssue === true &&
                    ticketDate === today
                  ) {
                    todayCompletedTickets++;
                  }
                });

                // Increment acceptedTicketNumber instead of replacing it
                await update(ref(db, `users/${row.original.id}`), {
                  todayAcceptedTickets: todayAcceptedTickets,
                  todayCompletedTickets: todayCompletedTickets,
                });
              }
            } catch (error) {
              console.error("Error fetching accepted tickets: ", error);
            }
          };

          fetchAcceptedTickets();
        }, [row.original]); // Run this effect when user changes

        return (
          <div className="font-medium cursor-pointer flex ">
            <p className="text-green-400 pr-2">
              {row.original.todayCompletedTickets}{" "}
            </p>{" "}
            /
            <p className="text-red-400 pl-2">
              {" "}
              {row.getValue("todayAcceptedTickets")}
            </p>
          </div>
        );
      },
    },
    itAssignedView && {
      id: "assignButton",
      accessorKey: "assignButton",
      header: itrole === "it-team" ? "Assign To" : null,
      cell: ({ row }) => (
        <div className="font-medium">
          <button
            className="bg-gray-300 py-1 px-3 rounded-sm"
            onClick={() =>
              // useEffect(() => {
              //   const updateTodayAssignedTickets = async () => {
              //    try {
              //     const today = startOfDay(new Date()); // Get today's date at midnight

              //     const todayAcceptedTicketsRef = ref(db, `users/${row.original.id}/acceptedTickets`);
              //     const todayAcceptedTicketsSnapshot = await get(todayAcceptedTicketsRef);
              //     const todayAcceptedTickets = [];
              //     const todayCompletedTickets = [];

              //     todayAcceptedTicketsSnapshot.forEach((childSnapshot) => {
              //       const ticketData = childSnapshot.val();

              //       if (ticketData) {
              //         const assignedTime = new Date(ticketData.assignedTime); // Convert to Date object
              //         const completedTime = new Date(ticketData.completedTime); // Convert to Date object

              //         if (ticketData.assigned && isSameDay(assignedTime, today)) {
              //           todayAcceptedTickets.push(ticketData);
              //         }

              //         if (ticketData.completedIssue && isSameDay(completedTime, today)) {
              //           todayCompletedTickets.push(ticketData);
              //         }
              //       }
              //     });

              //     console.log(todayAcceptedTickets);

              //     // Update user's ticket count
              //     await update(ref(db, `users/${row.original.id}`), {
              //       todayAcceptedTickets: todayAcceptedTickets.length,
              //       todayCompletedTickets: todayCompletedTickets.length,
              //     });

              //    } catch (error) {
              //     console.error("")

              //    }

              //   };

              //   updateTodayAssignedTickets();
              // }, [userlogin]),

              assignTicket(row.original.id)
            } // Assign the ticket
          >
            Assign
          </button>
        </div>
      ),
    },
    itrole === "faculty" && {
      id: "role",
      accessorKey: "role",
      header: "Change Role",
      cell: ({ row }) => {
        const changeUserRole = async (userRole) => {
          if (row.original.id) {
            await update(ref(db, `users/${row.original.id}`), {
              role: userRole,
            });
          }
          window.location.reload();
        };

        return (
          <div className="font-medium">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">change</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Change Role</DialogTitle>
                  <DialogDescription>
                    Make changes to profile here.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-4 py-4">
                  <div className="">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={row.original.photoURL}
                      alt="user Image"
                    />
                  </div>
                  <div className="">
                    <h2>Name : {row.original.fullName}</h2>
                    <p>Email : {row.original.email}</p>
                    <p>Role : {row.original.role}</p>
                  </div>
                </div>
                <DialogFooter className={`flex justify-between items-center`}>
                  <p className="font-bold">Change Role Into : </p>
                  {role === "admin" && (
                    <Button
                      onClick={() => changeUserRole("it-admin-executive")}
                    >
                      IT Admin
                    </Button>
                  )}
                  <Button onClick={() => changeUserRole("it-team")}>
                    IT Member
                  </Button>
                </DialogFooter>
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
        </Table>
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
