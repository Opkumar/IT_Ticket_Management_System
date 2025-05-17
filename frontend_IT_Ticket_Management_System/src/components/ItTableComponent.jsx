import { useState, useEffect, useMemo } from "react"
import { startOfDay, isSameDay, format } from "date-fns"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import useAuthStore from "@/store/useAuthStore"
import useTicketStore from "@/store/useTicketStore"

export default function ItTable({ itrole, itAssignedView, itReAssignedView, ticketDataOfRow, allUsers, allTickets }) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const { updateUser } = useAuthStore()
  const { updateTicket } = useTicketStore()
  const [selectedVenue, setSelectedVenue] = useState("")

  const data = useMemo(() => {
    return allUsers.filter((user) => user.role === itrole)
  }, [allUsers, itrole])

  useEffect(() => {
    const fetchAcceptedTickets = async () => {
      try {
        const today = format(new Date(), "dd/MM/yyyy")

        const updatedUsers = allUsers.map((user) => {
          let todayAcceptedTickets = 0
          let todayCompletedTickets = 0
          let totalAcceptedTickets = 0
          let totalCompletedTickets = 0

          allTickets
            .filter((ticket) => ticket.acceptedTicketByUserId === user._id)
            .forEach((ticket) => {
              if (!ticket.assignedAt) return

              const assignedDate = new Date(ticket.assignedAt)
              if (isNaN(assignedDate.getTime())) return

              const ticketDate = format(assignedDate, "dd/MM/yyyy")

              // Count today's accepted tickets
              if (ticket.assigned && ticketDate === today) {
                todayAcceptedTickets++
              }

              // Count today's completed tickets
              if (ticket.completedIssue && ticketDate === today) {
                todayCompletedTickets++
              }

              // Count total accepted tickets
              if (ticket.assigned) {
                totalAcceptedTickets++
              }

              // Count total completed tickets
              if (ticket.completedIssue) {
                totalCompletedTickets++
              }
            })

          return {
            ...user,
            todayAcceptedTickets,
            todayCompletedTickets,
            totalAcceptedTickets,
            totalCompletedTickets,
          }
        })

        await Promise.all(
          updatedUsers.map((user) =>
            updateUser({
              userId: user._id,
              todayAcceptedTickets: user.todayAcceptedTickets,
              todayCompletedTickets: user.todayCompletedTickets,
              totalAcceptedTickets: user.totalAcceptedTickets,
              totalCompletedTickets: user.totalCompletedTickets,
            }),
          ),
        )
      } catch (error) {
        console.error("Error fetching accepted tickets: ", error)
      }
    }

    fetchAcceptedTickets()
  }, [allTickets, allUsers, updateUser])

  const assignTicket = async (userId) => {
    try {
      const today = startOfDay(new Date())

      // Filter and count tickets based on the assigned and completed status
      const todayAcceptedTickets = allTickets.filter(
        (ticket) =>
          ticket.acceptedTicketByUserId === userId && ticket.assigned && isSameDay(new Date(ticket.assignedAt), today),
      )

      const todayCompletedTickets = allTickets.filter(
        (ticket) =>
          ticket.acceptedTicketByUserId === userId &&
          ticket.completedIssue &&
          isSameDay(new Date(ticket.completedTime), today),
      )

      // Update the user's stats in the database
      await updateUser({
        userId,
        todayAcceptedTickets: todayAcceptedTickets.length,
        todayCompletedTickets: todayCompletedTickets.length,
      })

      // Assign the new ticket
      await updateTicket({
        ticketId: ticketDataOfRow._id,
        acceptedTicketByUserId: userId,
        assigned: true,
        assignedAt: Date.now(),
      })

      console.log("Successfully assigned the ticket")
    } catch (error) {
      console.error("Error assigning ticket:", error)
    }
  }

  const reAssignTicket = async (userId) => {
    try {
      const today = startOfDay(new Date())

      // Filter and count tickets based on the assigned and completed status
      const todayAcceptedTickets = allTickets.filter(
        (ticket) =>
          ticket.acceptedTicketByUserId === userId && ticket.assigned && isSameDay(new Date(ticket.assignedAt), today),
      )

      const todayCompletedTickets = allTickets.filter(
        (ticket) =>
          ticket.acceptedTicketByUserId === userId &&
          ticket.completedIssue &&
          isSameDay(new Date(ticket.completedTime), today),
      )

      // Update the user's stats in the database
      await updateUser({
        userId,
        todayAcceptedTickets: todayAcceptedTickets.length,
        todayCompletedTickets: todayCompletedTickets.length,
      })

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
      })

      console.log("Successfully re-assigned the ticket")
      window.location.reload()
    } catch (error) {
      console.error("Error re-assigning ticket:", error)
    }
  }

  const columns = [
    {
      id: "select",
      header: "NO.",
      cell: ({ row }) => <p>{Number.parseInt(row.id) + 1}</p>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "fullname",
      accessorKey: "fullname",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("fullname")?.firstname} {row.getValue("fullname")?.lastname}
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
          className="flex items-center"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    itrole === "it-team" && {
      id: "todayAcceptedTickets",
      accessorKey: "todayAcceptedTickets",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <span>Today Assigned</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.setFilterValue([0, 2])}>0-2</DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.setFilterValue([3, 5])}>3-5</DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.setFilterValue([6, 100])}>6+</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium flex items-center gap-1">
          <span className="text-green-500">{row.original.todayCompletedTickets}</span>
          <span>/</span>
          <span className="text-red-500">{row.original.todayAcceptedTickets}</span>
        </div>
      ),
      filterFn: (row, id, filterValue) => {
        if (!filterValue) return true
        const count = row.original.todayAcceptedTickets || 0
        return count >= filterValue[0] && count <= filterValue[1]
      },
    },
    itrole === "it-team" && {
      id: "totalAcceptedTickets",
      accessorKey: "totalAcceptedTickets",
      header: ({ column }) => (
        <div className="flex items-center space-x-2">
          <span>Total Assigned</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.setFilterValue([0, 10])}>0-10</DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.setFilterValue([11, 30])}>11-30</DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.setFilterValue([31, 1000])}>31+</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium flex items-center gap-1">
          <span className="text-green-500">{row.original.totalCompletedTickets}</span>
          <span>/</span>
          <span className="text-red-500">{row.original.totalAcceptedTickets}</span>
        </div>
      ),
      filterFn: (row, id, filterValue) => {
        if (!filterValue) return true
        const count = row.original.totalAcceptedTickets || 0
        return count >= filterValue[0] && count <= filterValue[1]
      },
    },
    itAssignedView && {
      id: "assignButton",
      accessorKey: "assignButton",
      header: itrole === "it-team" ? "Assign To" : null,
      cell: ({ row }) => (
        <div className="font-medium">
          <Button variant="secondary" size="sm" onClick={() => assignTicket(row.original._id)}>
            Assign
          </Button>
        </div>
      ),
    },
    itReAssignedView && {
      id: "assignButton",
      accessorKey: "assignButton",
      header: itrole === "it-team" ? "Re-Assign To" : null,
      cell: ({ row }) => {
        const rowId = row.original._id
        const isAssignedToSelf = ticketDataOfRow?.acceptedTicketByUserId === rowId
        return (
          <div className="font-medium">
            {!isAssignedToSelf ? (
              <Button variant="secondary" size="sm" onClick={() => reAssignTicket(row.original._id)}>
                Re-Assign
              </Button>
            ) : (
              <p className="text-gray-400">Assigned</p>
            )}
          </div>
        )
      },
    },
    itrole === "faculty" && {
      id: "role",
      accessorKey: "role",
      header: "Change Role",
      cell: ({ row }) => {
        const changeUserRole = async (userRole) => {
          if (row.original._id) {
            await updateUser({
              userId: row.original._id,
              role: userRole,
              userVenue: selectedVenue,
            })
            window.location.reload()
          }
        }

        return (
          <div className="font-medium">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-100">
                  Change Role
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Change Role</DialogTitle>
                  <DialogDescription>Modify the user profile and assign roles here.</DialogDescription>
                </DialogHeader>

                {/* User Info Section */}
                <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                  <img
                    className="w-14 h-14 rounded-full border border-gray-300"
                    src={
                      row.original.userImage ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png" ||
                      "/placeholder.svg"
                    }
                    alt="User Avatar"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {row.original.fullname?.firstname} {row.original.fullname?.lastname}
                    </h2>
                    <p className="text-sm text-gray-500">{row.original.email}</p>
                    <p className="text-sm">
                      Role: <span className="text-orange-500 font-medium">{row.original.role}</span>
                    </p>
                  </div>
                </div>

                {/* Venue Selection */}
                <div className="space-y-3">
                  <Label>Select Specific Venue:</Label>
                  <RadioGroup value={selectedVenue} onValueChange={setSelectedVenue} className="flex flex-wrap gap-4">
                    {["Block A", "Block B", "Block C"].map((block) => (
                      <div key={block} className="flex items-center space-x-2">
                        <RadioGroupItem value={block} id={`block-${block}`} />
                        <Label htmlFor={`block-${block}`}>{block}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <DialogFooter className="mt-4">
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={() => changeUserRole("it-team")}
                    disabled={!selectedVenue}
                  >
                    Convert to IT Member
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )
      },
    },
  ].filter(Boolean)

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
  })

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
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

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-100">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => {
                  const rowId = row.original._id
                  const isAssignedToSelf = ticketDataOfRow?.acceptedTicketByUserId === rowId
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      className={isAssignedToSelf ? "bg-orange-50" : ""}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
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
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
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
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
