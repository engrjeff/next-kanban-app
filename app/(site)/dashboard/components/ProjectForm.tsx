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
import useCurrentProject from "@/hooks/useCurrentProject"
import useProjectFormToggle from "@/hooks/useProjectFormToggler"
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

import { createProject, updateProject } from "../services"
import { ProjectCreateInput, projectCreateSchema } from "../services/schema"

interface ProjectFormProps {
  boards: Board[]
}

function ProjectForm({ boards }: ProjectFormProps) {
  const projectFormState = useProjectFormToggle()
  const { currentProject, setCurrentProject } = useCurrentProject()

  const isEditing = currentProject !== null
  const formTitle = isEditing ? "Edit Project" : "Create Project"

  const handleOpenChange = (isOpen: boolean) => {
    // make sure to set the current project to null
    // on close
    if (!isOpen) {
      setCurrentProject(null)
    }

    projectFormState.toggle(isOpen)
  }

  return (
    <Dialog open={projectFormState.open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="h-8 w-8 rounded-full bg-orange-500 p-0 hover:bg-orange-400"
        >
          <span className="sr-only">Create Project</span>
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>
            Fill up the form below. Save the changes once done.
          </DialogDescription>
        </DialogHeader>
        <Form boards={boards} />
      </DialogContent>
    </Dialog>
  )
}

interface FormProps {
  boards: Board[]
}

const Form = ({ boards }: FormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const projectFormState = useProjectFormToggle()
  const { currentProject, setCurrentProject } = useCurrentProject()

  const router = useRouter()
  const projectForm = useForm<ProjectCreateInput>({
    resolver: zodResolver(projectCreateSchema),
    mode: "onSubmit",
    defaultValues: {
      boardId: currentProject?.boardId,
      name: currentProject?.name ?? "",
      description: currentProject?.description ?? "",
    },
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = projectForm

  const isEditing = currentProject !== null

  const onError: SubmitErrorHandler<ProjectCreateInput> = (errors) => {
    console.log(errors)
  }

  const onSubmit: SubmitHandler<ProjectCreateInput> = async (projectData) => {
    setIsLoading(true)

    const promise = isEditing
      ? updateProject(currentProject.id, projectData)
      : createProject(projectData)

    await toast
      .promise(promise, {
        pending: "Saving your project",
        success: "Project saved!",
        error: "An error has occured",
      })
      .finally(() => setIsLoading(false))

    setCurrentProject(null)
    projectFormState.closeForm()

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
      <Controller
        control={control}
        name="boardId"
        render={({ field }) => (
          <div className="flex flex-col space-y-2 pt-2">
            <Label htmlFor="boardId">Project Board</Label>
            <Select
              name="boardId"
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                className={cn({
                  "border-red-600": !!errors.boardId,
                })}
              >
                <SelectValue placeholder="Select a board" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Project Board</SelectLabel>
                  {boards.map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      {board.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.boardId && (
              <ErrorMessage>{errors.boardId?.message}</ErrorMessage>
            )}
          </div>
        )}
      />
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input
          aria-invalid={errors.name ? "true" : undefined}
          id="name"
          placeholder="Project Name"
          autoComplete="true"
          {...register("name")}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          aria-invalid={errors.description ? "true" : undefined}
          id="description"
          placeholder="Project description"
          autoComplete="true"
          rows={5}
          {...register("description")}
        />
        {errors.description && (
          <ErrorMessage>{errors.description.message}</ErrorMessage>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">
          {isLoading ? "Saving..." : "Save Project"}
        </Button>
      </div>
    </form>
  )
}

export default ProjectForm
