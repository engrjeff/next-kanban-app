import { z } from "zod"

export const projectCreateSchema = z.object({
  boardId: z.string({
    required_error: "Board is required",
  }),
  name: z
    .string({
      required_error: "Project name is required",
      invalid_type_error: "Invalid value for project name",
    })
    .min(1, { message: "Project name is required" }),
  description: z
    .string({
      required_error: "Project description is required",
      invalid_type_error: "Invalid value for project description",
    })
    .min(1, { message: "Project description is required" }),
})

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>

export const taskCreateSchema = z.object({
  projectId: z.string({
    required_error: "Project ID is required",
  }),
  columnId: z.string({
    required_error: "Task status is required",
  }),
  title: z
    .string({
      required_error: "Task title is required",
      invalid_type_error: "Invalid value for task title",
    })
    .min(1, { message: "Task title is required" }),
  content: z
    .string({
      required_error: "Task content is required",
      invalid_type_error: "Invalid value for task content",
    })
    .min(1, { message: "Task content is required" }),
})

export type TaskCreateInput = z.infer<typeof taskCreateSchema>
