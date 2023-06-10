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

import { createProject } from "../services"
import { ProjectCreateInput, projectCreateSchema } from "../services/schema"

interface ProjectFormProps {
  boards: Board[]
}

function ProjectForm({ boards }: ProjectFormProps) {
  const projectFormState = useProjectFormToggle()

  return (
    <Dialog open={projectFormState.open} onOpenChange={projectFormState.toggle}>
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
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a project by filling up the form below
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
  const router = useRouter()
  const projectForm = useForm<ProjectCreateInput>({
    resolver: zodResolver(projectCreateSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = projectForm

  const onError: SubmitErrorHandler<ProjectCreateInput> = (errors) => {
    console.log(errors)
  }

  const onSubmit: SubmitHandler<ProjectCreateInput> = async (projectData) => {
    setIsLoading(true)

    const createPromise = createProject(projectData)

    await toast
      .promise(createPromise, {
        pending: "Saving your project",
        success: "Project saved!",
        error: "An error has occured",
      })
      .finally(() => setIsLoading(false))

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
