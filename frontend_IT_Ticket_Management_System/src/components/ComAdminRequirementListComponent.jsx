import React, { useState, useEffect } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Filter, ChevronDown, MoreHorizontal, Download, Calendar } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"

import useRequirementStore from "@/store/useRequirementStore"
import { getFormattedDate } from "@/utils/dateTimeUtils"

const ComAdminRequirementList = () => {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [expandedRow, setExpandedRow] = useState(null)
  const [globalFilter, setGlobalFilter] = useState("")


  const { getAllRequirements, allRequirements: data } = useRequirementStore()

  const handleRowClick = (rowId) => {
    setExpandedRow((prevExpandedRow) => (prevExpandedRow === rowId ? null : rowId))
  }

  useEffect(() => {
    getAllRequirements()
  }, [getAllRequirements])

  const downloadExcel = () => {
    const tableData = table.getRowModel().rows.map((row) => {
      return {
        "No. of Components": row.original.components?.length || 0,
        "Components Name": row.original.components?.join(", ") || "N/A",
        "Starting Date":
          row.original.startingDate && row.original.startingTime
            ? `${getFormattedDate(row.original.startingDate)} at ${row.original.startingTime}`
            : "N/A",
        "Ending Date":
          row.original.endingDate && row.original.endingTime
            ? `${getFormattedDate(row.original.endingDate)} at ${row.original.endingTime}`
            : "N/A",
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(tableData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requirement Report")

    XLSX.writeFile(workbook, "requirement_report.xlsx")
  }

  const columns = [
    {
      accessorKey: "componentCount",
      meta: { label: "No. of Components" },
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>No. of Components</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue([1, 3])}>1-3</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue([4, 6])}>4-6</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue([7, 10])}>7-10</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue([11, 100])}>11+</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.original.components?.length || 0}
        </Badge>
      ),
      filterFn: (row, id, filterValue) => {
        if (!filterValue) return true
        const count = row.original.components?.length || 0
        return count >= filterValue[0] && count <= filterValue[1]
      },
    },
    {
      accessorKey: "components",
      meta: { label: "Components" },
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>Components</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
                <Input
                  placeholder="Filter components..."
                  value={column.getFilterValue() || ""}
                  onChange={(e) => column.setFilterValue(e.target.value)}
                  className="max-w-sm mb-2"
                />
                <DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>All Components</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Monitor")}>Monitor</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Keyboard")}>Keyboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Mouse")}>Mouse</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("CPU")}>CPU</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Printer")}>Printer</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Scanner")}>Scanner</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Router")}>Router</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("Switch")}>Switch</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">
          {row.original.components?.map((component, index) => (
            <Badge key={index} variant="secondary" className="mr-1 mb-1">
              {component}
            </Badge>
          ))}
        </div>
      ),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true
        const components = row.getValue(columnId) || []
        if (!Array.isArray(components)) return false
        return components.some((component) => component.toLowerCase().includes(filterValue.toLowerCase()))
      },
    },
    {
      accessorKey: "startingDate",
      meta: { label: "Start Date" },
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>Start Date</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Calendar className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>All Dates</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("today")}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("yesterday")}>Yesterday</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("thisWeek")}>This Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("lastWeek")}>Last Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("thisMonth")}>This Month</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("lastMonth")}>Last Month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <div>{getFormattedDate(row.getValue("startingDate"))}</div>
          <div className="text-xs text-muted-foreground">{row.original.startingTime}</div>
        </div>
      ),
      filterFn: (row, id, filterValue) => {
        if (!filterValue) return true

        const date = new Date(row.getValue("startingDate"))
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const thisWeekStart = new Date(today)
        thisWeekStart.setDate(today.getDate() - today.getDay())

        const lastWeekStart = new Date(thisWeekStart)
        lastWeekStart.setDate(lastWeekStart.getDate() - 7)

        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)

        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)

        switch (filterValue) {
          case "today":
            return date >= today && date < new Date(today.getTime() + 86400000)
          case "yesterday":
            return date >= yesterday && date < today
          case "thisWeek":
            return date >= thisWeekStart
          case "lastWeek":
            return date >= lastWeekStart && date < thisWeekStart
          case "thisMonth":
            return date >= thisMonthStart
          case "lastMonth":
            return date >= lastMonthStart && date < thisMonthStart
          default:
            return true
        }
      },
    },
    {
      accessorKey: "endingDate",
      meta: { label: "End Date" },
      header: ({ column }) => {
        return (
          <div className="flex items-center space-x-2">
            <span>End Date</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Calendar className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.setFilterValue(undefined)}>All Dates</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("today")}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("yesterday")}>Yesterday</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("thisWeek")}>This Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("lastWeek")}>Last Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("thisMonth")}>This Month</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue("lastMonth")}>Last Month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <div>{getFormattedDate(row.getValue("endingDate"))}</div>
          <div className="text-xs text-muted-foreground">{row.original.endingTime}</div>
        </div>
      ),
      filterFn: (row, id, filterValue) => {
        if (!filterValue) return true

        const date = new Date(row.getValue("endingDate"))
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const thisWeekStart = new Date(today)
        thisWeekStart.setDate(today.getDate() - today.getDay())

        const lastWeekStart = new Date(thisWeekStart)
        lastWeekStart.setDate(lastWeekStart.getDate() - 7)

        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)

        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)

        switch (filterValue) {
          case "today":
            return date >= today && date < new Date(today.getTime() + 86400000)
          case "yesterday":
            return date >= yesterday && date < today
          case "thisWeek":
            return date >= thisWeekStart
          case "lastWeek":
            return date >= lastWeekStart && date < thisWeekStart
          case "thisMonth":
            return date >= thisMonthStart
          case "lastMonth":
            return date >= lastMonthStart && date < thisMonthStart
          default:
            return true
        }
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRowClick(row.id)}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )
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
    globalFilterFn: (row, _columnIds, filterValue) => {
      const columnsToFilter = ["components"]
      const filterValueLower = String(filterValue).toLowerCase()

      return columnsToFilter.some((columnId) => {
        const value = row.getValue(columnId)
        if (Array.isArray(value)) {
          return value.some((item) => String(item).toLowerCase().includes(filterValueLower))
        }
        return String(value).toLowerCase().includes(filterValueLower)
      })
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  return (
    <div className="w-full px-4 md:px-10 py-2">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-4">
        <Input
          placeholder="Filter requirements..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={downloadExcel} variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download Report</span>
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
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
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
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
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
                        className={row.getIsSelected() ? "bg-blue-50" : "bg-gray-50"}
                      >
                        <TableCell colSpan={columns.length}>
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-xl mb-4">Requirement Detail</h4>
                              <div className="space-y-4">
                                <div className="border rounded-md p-3 bg-white">
                                  <h2 className="text-lg font-medium">Requirement Raised By:</h2>
                                  <p>
                                    <span className="font-medium">Name:</span> {row.original.fullname?.firstname}{" "}
                                    {row.original.fullname?.lastname}
                                  </p>
                                  <p>
                                    <span className="font-medium">Email:</span> {row.original.email}
                                  </p>
                                </div>

                                <div className="border rounded-md p-3 bg-white">
                                  <h2 className="text-lg font-medium mb-2">Requirement History</h2>
                                  <ScrollArea className="h-[200px] md:h-auto md:max-h-[300px]">
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2">
                                        {row.original.assigned ? (
                                          <div className="h-4 w-4 rounded-full bg-blue-500" />
                                        ) : (
                                          <div className="h-4 w-4 rounded-full border border-gray-300" />
                                        )}
                                        <div>
                                          <p className="font-medium">Requirement Assigned:</p>
                                          {row.original.assigned ? (
                                            <p className="text-sm text-gray-600">
                                              {new Date(row.original.assignedTime).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                hour12: true,
                                              })}
                                            </p>
                                          ) : (
                                            <p className="text-sm text-gray-500">Not assigned</p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        {row.original.completedRequirement ? (
                                          <div className="h-4 w-4 rounded-full bg-blue-500" />
                                        ) : (
                                          <div className="h-4 w-4 rounded-full border border-gray-300" />
                                        )}
                                        <div>
                                          <p className="font-medium">Requirement Completed:</p>
                                          {row.original.completedRequirement ? (
                                            <p className="text-sm text-gray-600">
                                              {new Date(row.original.completedRequirementTime).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                hour12: true,
                                              })}
                                            </p>
                                          ) : (
                                            <p className="text-sm text-gray-500">Not completed</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </ScrollArea>
                                </div>
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

export default ComAdminRequirementList
