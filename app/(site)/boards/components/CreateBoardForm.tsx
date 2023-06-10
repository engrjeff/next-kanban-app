"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Circle, Plus, X } from "lucide-react"
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form"
import { toast } from "react-toastify"

import { cn } from "@/lib/utils"
import useBoardFormToggle from "@/hooks/useBoardFormToggler"
import { Button } from "@/components/ui/button"
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import ErrorMessage from "@/components/error-message"

import { createBoard } from "../services"
import { BoardCreateInput, boardCreateSchema } from "../services/schema"

const MAX_COLUMNS = 4

export default function CreateBoardForm() {
  const boardFormState = useBoardFormToggle()

  return (
    <Sheet open={boardFormState.open} onOpenChange={boardFormState.toggle}>
      <SheetTrigger asChild>
        <Button onClick={boardFormState.openForm}>
          <Plus className="mr-2 h-4 w-4" /> Create Board
        </Button>
      </SheetTrigger>
      <SheetContent
        forceMount
        position="right"
        size="default"
        className="w-[700px]"
      >
        <Form />
      </SheetContent>
    </Sheet>
  )
}

const Form = () => {
  const [isLoading, setIsLoading] = useState(false)
  const boardFormState = useBoardFormToggle()
  const router = useRouter()
  const boardForm = useForm<BoardCreateInput>({
    resolver: zodResolver(boardCreateSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
      columns: [
        {
          name: "",
          order: 1,
        },
        {
          name: "",
          order: 2,
        },
      ],
    },
  })

  const {
    watch,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = boardForm

  const nextOrder = watch("columns").length + 1
  const hasReachedMaxColumns = nextOrder === MAX_COLUMNS + 1

  const columns = useFieldArray({
    control,
    name: "columns",
  })

  const onError: SubmitErrorHandler<BoardCreateInput> = (errors) => {
    console.log(errors)
  }

  const onSubmit: SubmitHandler<BoardCreateInput> = async (boardData) => {
    setIsLoading(true)

    const createPromise = createBoard(boardData)

    await toast
      .promise(createPromise, {
        pending: "Saving your board",
        success: "Board saved!",
        error: "An error has occured",
      })
      .finally(() => setIsLoading(false))

    boardFormState.closeForm()

    // refresh
    router.refresh()
  }

  return (
    <form
      className={cn({ "pointer-events-none opacity-75": isLoading })}
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <SheetHeader>
        <SheetTitle>Create Board</SheetTitle>
        <SheetDescription>
          Create a new board by filling up the form below
        </SheetDescription>
      </SheetHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-3">
          <Label htmlFor="name">Board Name</Label>
          <Input
            aria-invalid={errors.name ? "true" : undefined}
            id="name"
            placeholder="Board name"
            autoComplete="true"
            {...register("name")}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>
        <div className="space-y-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            aria-invalid={errors.description ? "true" : undefined}
            id="description"
            placeholder="Board description"
            autoComplete="true"
            rows={7}
            {...register("description")}
          />
          {errors.description && (
            <ErrorMessage>{errors.description.message}</ErrorMessage>
          )}
        </div>
        <div className="space-y-3">
          <div>
            <Label>Columns</Label>
            <p className="text-sm text-muted-foreground">
              Add at least 2 columns
            </p>
          </div>
          {columns.fields.map((column, index) => (
            <div key={column.id} className="grid grid-cols-12 gap-3">
              <div className="col-span-7 space-y-2">
                <Input
                  aria-invalid={
                    errors.columns && errors.columns[index]?.name
                      ? "true"
                      : undefined
                  }
                  placeholder="e.g. TO DO, IN PROGRESS"
                  {...register(`columns.${index}.name`)}
                />
                {errors.columns && errors.columns[index]?.name && (
                  <ErrorMessage>
                    {errors.columns[index]?.name?.message}
                  </ErrorMessage>
                )}
              </div>
              <Controller
                control={control}
                name={`columns.${index}.color`}
                render={({ field }) => (
                  <div className="col-span-4 flex flex-col space-y-2">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={cn({
                          "border-red-600":
                            errors.columns && errors.columns[index]?.color,
                        })}
                      >
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Column Color</SelectLabel>
                          <SelectItem value="bg-sky-500">
                            <span className="flex flex-row-reverse items-center gap-3">
                              Blue
                              <Circle className="h-2 w-2 fill-sky-500 text-sky-500" />
                            </span>
                          </SelectItem>
                          <SelectItem value="bg-emerald-500">
                            <span className="flex flex-row-reverse items-center gap-3">
                              Green
                              <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
                            </span>
                          </SelectItem>
                          <SelectItem value="bg-orange-500">
                            <span className="flex flex-row-reverse items-center gap-3">
                              Orange
                              <Circle className="h-2 w-2 fill-orange-500 text-orange-500" />
                            </span>
                          </SelectItem>
                          <SelectItem value="bg-amber-500">
                            <span className="flex flex-row-reverse items-center gap-3">
                              Yellow
                              <Circle className="h-2 w-2 fill-amber-500 text-amber-500" />
                            </span>
                          </SelectItem>
                          <SelectItem value="bg-purple-500">
                            <span className="flex flex-row-reverse items-center gap-3">
                              Purple
                              <Circle className="h-2 w-2 fill-purple-500 text-purple-500" />
                            </span>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.columns && errors.columns[index]?.color && (
                      <ErrorMessage>
                        {errors.columns[index]?.color?.message}
                      </ErrorMessage>
                    )}
                  </div>
                )}
              />
              <Input
                type="hidden"
                disabled
                {...register(`columns.${index}.order`)}
              />
              <Button
                variant="outline"
                className="col-span-1 p-0"
                onClick={() => columns.remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {!hasReachedMaxColumns && (
          <Button
            onClick={() => {
              columns.append({
                name: "",
                order: nextOrder,
                color: "",
              })
            }}
            size="sm"
            type="button"
            className="ml-auto"
          >
            Add Column
          </Button>
        )}
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button
            type="button"
            variant="outline"
            onClick={boardFormState.closeForm}
          >
            Cancel
          </Button>
        </SheetClose>
        <Button type="submit">{isLoading ? "Saving..." : "Save Board"}</Button>
      </SheetFooter>
    </form>
  )
}
