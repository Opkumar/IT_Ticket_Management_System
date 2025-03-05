"use client"

import React, { useState, useEffect } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { type Ticket, ticketData } from "@/lib/data"
import { downloadToExcel } from "@/lib/xlsx"

export function TicketTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [ticketDetails, setTicketDetails] = useState<any | null>(null)
  const [data, setData] = useState<Ticket[]>(ticketData)

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "id",
      header: "Ticket ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <div className="cursor-pointer text-blue-600 hover:underline" onClick={() => toggleRowExpansion(row.id)}>
          {row.getValue("subject")}
        </div>
      ),
    },
    {
      accessorKey: "typeIssue",
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>Category</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Network / Connectivity")}>
                  Network / Connectivity
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Laptop")}>Laptop</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Desktop")}>Desktop</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Printer")}>Printer</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Software Issue")}>
                  Software Issue
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Email & Communication Issue")}>
                  Email & Communication
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("User Account & Access Issue")}>
                  User Account & Access Issue
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("IT Support Services")}>
                  IT Support Services
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Backup & Recovery Issues")}>
                  Backup & Recovery Issues
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      cell: ({ row }) => <div>{row.getValue("typeIssue")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>Status</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Open")}>Open</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("In Progress")}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Resolved")}>Resolved</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={
              status === "Open"
                ? "default"
                : status === "In Progress"
                  ? "secondary"
                  : status === "Resolved"
                    ? "success"
                    : "outline"
            }
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "urgent",
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>Priority</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue(true)}>Urgent</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue(false)}>Normal</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      cell: ({ row }) => {
        const isUrgent = row.getValue("urgent") as boolean
        return <Badge variant={isUrgent ? "destructive" : "outline"}>{isUrgent ? "Urgent" : "Normal"}</Badge>
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as string)
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: "acceptedTicketByUserId",
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>Assigned To</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("")}>No Assign</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("John Doe")}>John Doe</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Jane Smith")}>Jane Smith</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      cell: ({ row }) => {
        const assignedTo = row.getValue("acceptedTicketByUserId") as string
        return <div>{assignedTo || "No Assign"}</div>
      },
    },
  ]

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  })

  // Apply filter for specific fields
  const applyFilter = (field: string, value: any) => {
    // First, remove any existing filter for this field
    const updatedFilters = columnFilters.filter((filter) => filter.id !== field)

    // Then add the new filter
    setColumnFilters([...updatedFilters, { id: field, value }])
  }

  // Special filter for assigned/unassigned
  const applyFilter2 = (field: string, value: string) => {
    const updatedFilters = columnFilters.filter((filter) => filter.id !== field)

    if (value === "No Assign") {
      setColumnFilters([
        ...updatedFilters,
        {
          id: field,
          value: "", // Empty string represents unassigned
        },
      ])
    } else {
      setColumnFilters([...updatedFilters, { id: field, value }])
    }
  }

  // Toggle row expansion
  const toggleRowExpansion = (rowId: string) => {
    if (expandedRow === rowId) {
      setExpandedRow(null)
    } else {
      setExpandedRow(rowId)
      // Fetch ticket details (simulated)
      const ticket = data.find((t) => t.id === rowId)
      if (ticket) {
        setTicketDetails(ticket.details)
      }
    }
  }

  // Download Excel function
  const downloadExcel = () => {
    downloadToExcel(data, "tickets")
  }

  // Effect to apply global filter
  useEffect(() => {
    table.setGlobalFilter(globalFilter)
  }, [globalFilter, table])

  return (
    <div className="w-full p-10">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter tickets..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={downloadExcel} className="ml-4 bg-green-500 hover:bg-green-600 text-white">
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
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
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
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                  {expandedRow === row.id && (
                    <TableRow
                      data-state={row.getIsSelected() ? "selected" : ""}
                      className={row.getIsSelected() ? "bg-blue-100" : ""}
                    >
                      <TableCell colSpan={columns.length}>
                        <div className="p-4">
                          <h4 className="font-semibold text-2xl mb-2">Ticket Detail</h4>
                          <div>
                            <div className="grid gap-4">
                              <div className="border rounded-sm">
                                <h2 className="text-xl ml-2 mt-2">Ticket Raised By:</h2>
                                <p className="ml-2">
                                  Name: {row.original.fullname?.firstname} {row.original.fullname?.lastname}
                                </p>
                                <p className="ml-2 mb-2">Email: {row.original.email}</p>
                              </div>
                            </div>
                            {ticketDetails ? (
                              <div className="border rounded-sm">
                                <h2 className="text-xl ml-2 mt-2">Ticket History</h2>
                                <div className="flex items-center gap-2 ml-2">
                                  {ticketDetails.assigned ? <span className="text-blue-500">✓</span> : <span>○</span>}
                                  <div className="flex items-center gap-2">
                                    <p>Ticket assigned: </p>
                                    {ticketDetails.assigned ? (
                                      <p className="ml-2">
                                        {new Date(ticketDetails.assignedAt).toLocaleString("en-US", {
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
                                    <span className="text-blue-500">✓</span>
                                  ) : (
                                    <span>○</span>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <p>Start working on Ticket: </p>
                                    {ticketDetails.startToTicket ? (
                                      <p className="ml-2">
                                        {new Date(ticketDetails.startWorkingOnTicketIssueTime).toLocaleString("en-US", {
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
                                <div className="flex items-center gap-2 ml-2 mb-2">
                                  {ticketDetails.completedIssue ? (
                                    <span className="text-blue-500">✓</span>
                                  ) : (
                                    <span>○</span>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <p>Issue solved or completed: </p>
                                    {ticketDetails.completedIssue ? (
                                      <p className="ml-2">
                                        {new Date(ticketDetails.completedTime).toLocaleString("en-US", {
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}

