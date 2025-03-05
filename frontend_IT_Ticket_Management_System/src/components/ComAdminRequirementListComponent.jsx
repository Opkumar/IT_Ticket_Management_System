import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

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
import useRequirementStore from "@/store/useRequirementStore";
import { getFormattedDate } from "@/utils/dateTimeUtils";

const ComAdminRequirementList = () => {
  // const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);

  const {getAllRequirements,allRequirements:data} = useRequirementStore();

  const handleRowClick = (rowId) => {
    setExpandedRow((prevExpandedRow) =>
      prevExpandedRow === rowId ? null : rowId
    );
  };

  useEffect(() => {
    // const fetchData = () => {
    //   const ticketRef = ref(db, "requirement");
    //   onValue(
    //     ticketRef,
    //     (snapshot) => {
    //       if (snapshot.exists()) {
    //         const ticketList = Object.values(snapshot.val()); // Make sure data is in array format
    //         setData(ticketList);
    //       } else {
    //         console.log("No data available");
    //       }
    //     },
    //     (error) => {
    //       console.error("Error fetching data:", error);
    //     }
    //   );
    // };

    // fetchData();
    getAllRequirements();
  }, [getAllRequirements]);

  const columns = [
    {
      accessorKey: "componentCount", // Changed key to make it unique
      header: "No. of components",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.components?.length}</div>
      ),
    },
    {
      accessorKey: "components", // Changed key to make it unique
      header: "Components Name",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.components?.map((component, index) => (
            <p key={index}>{component}</p>
          ))}
        </div>
      ),
      filterFn: (row, columnId, filterValue) => {
        // Custom filter logic for arrays
        const components = 
        row.getValue(columnId) ||
         [];
        if (!Array.isArray(components)) return false;
        return components.some((component) =>
          component.toLowerCase().includes(filterValue.toLowerCase())
        );
      },
    },
    {
      accessorKey: "startingDate",
      header: "To",
      cell: ({ row }) => (
        <div className="capitalize">
          {getFormattedDate(row.getValue("startingDate"))} at {row.original.startingTime}
        </div>
      ),
    },
    {
      accessorKey: "endingDate",
      header: "From",
      cell: ({ row }) => (
        <div className="capitalize">
          {getFormattedDate(row.getValue("endingDate"))} at {row.original.endingTime}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            className="h-8 w-8 p-0 bg-slate-400"
            onClick={() => {}}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];
  
  // const columns = [
  //   {
  //     accessorKey: "components",
  //     header: "No. of components",
  //     cell: ({ row }) => (
  //       <div className="capitalize">{row.original.components?.length}</div>
  //     ),
  //   },
  //   {
  //     accessorKey: "components",
  //     header: "Components Name",
  //     cell: ({ row }) => (
  //       <div className="capitalize">
  //         {row.original.components?.map((component, index) => (
  //           <p
  //           >
  //             {component}
  //           </p>
  //         ))}
  //       </div>
  //     ),
  //     filterFn: (row, columnId, filterValue) => {
  //       // Custom filter logic for arrays
  //       const components = row.getValue(columnId) || [];
  //       if (!Array.isArray(components)) return false;
  //       return components.some((component) =>
  //         component.toLowerCase().includes(filterValue.toLowerCase())
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "startingDate",
  //     header: "To",
  //     cell: ({ row }) => (
  //       <div className="capitalize">
  //         {row.getValue("startingDate")} at {row.original.startingTime}
  //       </div>
  //     ),
  //   },
  //   {
  //     accessorKey: "endingDate",
  //     header: "Form",
  //     cell: ({ row }) => (
  //       <div className="capitalize">
  //         {row.getValue("endingDate")} at {row.original.endingTime}
  //       </div>
  //     ),
  //   },
  //   {
  //     id: "actions",
  //     enableHiding: false,
  //     cell: ({ row }) => {
  //       return (
  //         // Use return to output JSX
  //         <Button
  //           variant="outline"
  //           className="h-8 w-8 p-0 bg-slate-400"
  //           onClick={() => {}}
  //         >
  //           <MoreHorizontal className="h-4 w-4" />
  //         </Button>
  //       );
  //     },
  //   },
  // ];

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
    <div className="w-full p-10">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Requirement..."
          value={table.getColumn("components")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("components")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
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
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
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
                    onClick={() => handleRowClick(row.id)} // Toggle expanded row on click
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
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        <div className="p-4">
                          <h4 className="font-semibold text-2xl mb-2">
                            Requirement Detail
                          </h4>
                          <div>
                            <div className="grid gap-4 mb-5">
                              <div className=" border rounded-sm `">
                                <h2 className="text-xl ml-2 mt-2">
                                  Requirement Raised By :-
                                </h2>
                                <p className="ml-2">
                                  Name: {row.original.fullname?.firstname} {row.original.fullname?.lastname}
                                </p>
                                <p className="ml-2 mb-2">
                                  Email: {row.original.email}
                                </p>
                              </div>
                            </div>
                            <div className="border rounded-sm">
                              <h2 className="text-xl ml-2 mt-2">
                                Requirement History :-
                              </h2>
                              <div className="flex items-center gap-2 ml-2">
                                {row.original.assigned ? (
                                  <i className="fa-solid fa-circle-check text-blue-500"></i>
                                ) : (
                                  <i className="fa-solid fa-circle "></i>
                                )}
                                <div className="flex items-center gap-2">
                                  <p>Requirement Assigned At : </p>
                                  {row.original.assigned ? (
                                    <p className="ml-2">
                                      {new Date(
                                        row.original.assignedTime
                                      ).toLocaleString(
                                        "en-US", // Change to desired locale
                                        {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "numeric",
                                          minute: "numeric",
                                          hour12: true, // Set to false for 24-hour format
                                        }
                                      )}
                                    </p>
                                  ) : (
                                    <p>null</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-2">
                                {row.original.completedRequirement ? (
                                  <i className="fa-solid fa-circle-check text-blue-500"></i>
                                ) : (
                                  <i className="fa-solid fa-circle "></i>
                                )}
                                <div className="flex items-center gap-2">
                                  <p>Requirement Completed At : </p>
                                  {row.original.completedRequirement ? (
                                    <p className="ml-2">
                                      {new Date(
                                        row.original.completedRequirementTime
                                      ).toLocaleString(
                                        "en-US", // Change to desired locale
                                        {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "numeric",
                                          minute: "numeric",
                                          hour12: true, // Set to false for 24-hour format
                                        }
                                      )}
                                    </p>
                                  ) : (
                                    <p>null</p>
                                  )}
                                </div>
                              </div>
                            </div>
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
      <div className="flex items-center justify-end space-x-2 py-4">
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
  );
};

export default ComAdminRequirementList;
