"use client"

import { Plus } from "lucide-react"

import useTaskFormToggle from "@/hooks/useTaskFormToggler"
import { Button } from "@/components/ui/button"

interface AddTaskButtonProps {
  columnId: string
  columnName: string
}

function AddTaskButton({ columnId, columnName }: AddTaskButtonProps) {
  const { openForm, setInitialColumn } = useTaskFormToggle()

  const handleClick = () => {
    setInitialColumn(columnId)

    openForm()
  }

  return (
    <Button
      variant="ghost"
      className="-mt-1 h-7 w-7 rounded-full bg-background/30 p-0"
      onClick={handleClick}
    >
      <Plus className="h-4 w-4" />
      <span className="sr-only">Add task under {columnName}</span>
    </Button>
  )
}

export default AddTaskButton
