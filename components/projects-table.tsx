"use client"

import { Download, MoreHorizontal, Trash2 } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Sample project data
const projects = [
  {
    id: "1",
    name: "E-commerce Database",
  },
  {
    id: "2",
    name: "Blog Platform Schema",
  },
  {
    id: "3",
    name: "Task Management System",
  },
]

export function ProjectsTable({ simplified = false }: { simplified?: boolean }) {
  return (
    <div className="rounded-md border border-white/10">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="border-white/10 hover:bg-cryptic-background/50">
              <TableCell className="font-medium text-[14px]">{project.name}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="dropdownTrigger" size="icon" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-cryptic-card border-white/10">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Download className="h-4 w-4" />
                      <span>Download source files</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 text-red-500 focus:text-red-500 cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
