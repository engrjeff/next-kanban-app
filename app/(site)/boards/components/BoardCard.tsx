"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "react-toastify"

import { cn } from "@/lib/utils"
import useBoardFormToggle from "@/hooks/useBoardFormToggler"
import useCurrentBoard from "@/hooks/useCurrentBoard"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { deleteBoard, type Board } from "../services"

function BoardCard({ board }: { board: Board }) {
  const [deleteDialogShown, setDeleteDialogShown] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const openForm = useBoardFormToggle((state) => state.openForm)
  const setCurrentBoard = useCurrentBoard((state) => state.setCurrentBoard)
  const router = useRouter()

  const isDeletable = board.projects.length === 0

  const handleEditClick = () => {
    setCurrentBoard(board)

    openForm()
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteBoard(board.id)
    setIsDeleting(false)

    setDeleteDialogShown(false)

    toast.success("Board deleted!")

    router.refresh()
  }

  return (
    <>
      <Card>
        <CardHeader className="relative">
          <CardTitle>{board.name}</CardTitle>
          <CardDescription>{board.description}</CardDescription>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="absolute right-2 top-2">
              <Button
                variant="outline"
                aria-label="board options"
                className="h-7 w-7 rounded-full p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" forceMount>
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button className="w-full" onClick={handleEditClick}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  disabled={!isDeletable}
                  className="w-full disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => setDeleteDialogShown(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <Badge>{board.projects.length} Projects</Badge>
          <Button className="mt-4 w-full">View</Button>
        </CardContent>
      </Card>
      <AlertDialog open={deleteDialogShown} onOpenChange={setDeleteDialogShown}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you really want to delete <strong>{board.name}</strong>?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              board.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }), {
                "opacity-70 pointer-events-none": isDeleting,
              })}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default BoardCard
