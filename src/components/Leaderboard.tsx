"use client";

import * as React from "react";
import { CaretSortIcon, ChevronDownIcon,MixerHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

export type Team = {
  team_id: number;
  points: number;
  team_name: string;
};

// const sortedData = data.sort((a, b) => b.points - a.points);

export function Leaderboard() {
  const [teams, setTeams] = React.useState<Team[]>([]); // To store the fetched data
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const sortedTeams = React.useMemo(() => {
    return [...teams].sort((a, b) => b.points - a.points);
  }, [teams]);

  // fetch team data function
  const fetchTeamData = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/teams`)
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching team data:", error);
      });
  };

  // Fetch data using Axios when the component mounts
  React.useEffect(fetchTeamData, []); // calling fetchTeamData directly in useEffect

  // Define the columns for the table
  const columns: ColumnDef<Team>[] = [
    {
      id: "index",
      // header: "#",
      header: ({  }) => <div className="sm:pl-4" >#</div>,

      cell: ({ row }) => {
        return (
          <div className="sm:pl-4">
            {sortedTeams.findIndex((team) => team.team_id === row.original.team_id) + 1}
          </div>
        );
      },
      
    },
    {
      accessorKey: "team_name",
      enableHiding: true,

      header: ({ column }) => {
        return (
          <div className="">
            <Button
            className="   -ml-4 text-left     "
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Team Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="uppercase  sm:w-72 w-40 ">
          {row.getValue("team_name")}
        </div>
      ),
    },

    {
      accessorKey: "points",
      enableHiding: false,

      header: ({ column }) => {
        return (
             <div className="-mx-4 flex justify-center sm:mx-0">
               <Button
            variant="ghost"
            className="     "
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Points
            <CaretSortIcon className="ml-1 h-4 w-4" />
          </Button>
             </div>
        );
      },
      cell: ({ row }) => {
        const points = parseFloat(row.getValue("points"));
        return (
          <div className=" text-center">{points}</div>
        );
      },
    },
    {
      accessorKey: "team_id",
      enableHiding: false,

      header: ({  }) => <div className="flex justify-center  -mx-6  " >Team ID</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("team_id")}</div>,
    }
  ];
  const table = useReactTable({
    data: sortedTeams, // Use the sortedTeams here
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
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
          placeholder="Filter Teams..."
          value={
            (table.getColumn("team_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("team_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm  mr-4"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className=" ml-auto">
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />

              View <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const mapIdToDisplayText = (id: string): string => {
                  switch (id) {
                    case "team_name":
                      return "Team Name";
                    case "team_id":
                      return "Team ID";
                    default:
                      return id;
                  }
                };

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-sm"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {mapIdToDisplayText(column.id)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md w-full border">
        <Table >
          <TableHeader >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="  " key={header.id}>
                     <div className=" ">
                     {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                     </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  className="h-10 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
