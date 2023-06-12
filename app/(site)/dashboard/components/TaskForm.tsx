"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Board } from "@prisma/client"
import { Plus } from "lucide-react"
import {
  Controller,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form"
import { toast } from "react-toastify"

import { cn } from "@/lib/utils"
import useTaskFormToggler from "@/hooks/useTaskFormToggler"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import ErrorMessage from "@/components/error-message"

import { Project, createTask } from "../services"
import { TaskCreateInput, taskCreateSchema } from "../services/schema"

interface Props {
  project: Project
}

function TaskForm({ project }: Props) {
  const taskFormState = useTaskFormToggler()

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      taskFormState.setInitialColumn(null)
    }

    taskFormState.toggle(isOpen)
  }

  return (
    <Dialog open={taskFormState.open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="rounded-full bg-orange-500 hover:bg-orange-400"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Create Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Create a task for {project.name}
          </DialogDescription>
        </DialogHeader>
        <Form project={project} />
      </DialogContent>
    </Dialog>
  )
}

const Form = ({ project }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const taskFormState = useTaskFormToggler()
  const router = useRouter()
  const taskForm = useForm<TaskCreateInput>({
    resolver: zodResolver(taskCreateSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      content: "",
      projectId: project.id,
      columnId: taskFormState.initialColumn ?? project.board.columns[0].id,
    },
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = taskForm

  const onError: SubmitErrorHandler<TaskCreateInput> = (errors) => {
    console.log(errors)
  }

  const onSubmit: SubmitHandler<TaskCreateInput> = async (taskData) => {
    setIsLoading(true)

    const createPromise = createTask(taskData)

    await toast
      .promise(createPromise, {
        pending: "Saving your task",
        success: "Task saved!",
        error: "An error has occured",
      })
      .finally(() => setIsLoading(false))

    taskFormState.closeForm()

    // refresh
    router.refresh()
  }

  return (
    <form
      className={cn("space-y-3", {
        "pointer-events-none opacity-75": isLoading,
      })}
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          aria-invalid={errors.title ? "true" : undefined}
          id="title"
          placeholder="Task title"
          autoComplete="true"
          {...register("title")}
        />
        {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          aria-invalid={errors.content ? "true" : undefined}
          id="content"
          placeholder="Task content"
          autoComplete="true"
          rows={5}
          {...register("content")}
        />
        {errors.content && (
          <ErrorMessage>{errors.content.message}</ErrorMessage>
        )}
      </div>

      <Controller
        control={control}
        name="columnId"
        render={({ field }) => (
          <div className="flex flex-col space-y-2 pt-2">
            <Label htmlFor="columnId">Task Status</Label>
            <Select
              name="columnId"
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                className={cn({
                  "border-red-600": !!errors.columnId,
                })}
              >
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Task Status</SelectLabel>
                  {project.board.columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.columnId && (
              <ErrorMessage>{errors.columnId?.message}</ErrorMessage>
            )}
          </div>
        )}
      />

      <div className="flex justify-end pt-4">
        <Button type="submit">{isLoading ? "Saving..." : "Save Task"}</Button>
      </div>
    </form>
  )
}

export default TaskForm
