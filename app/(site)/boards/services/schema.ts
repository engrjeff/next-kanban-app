import { z } from "zod"

export const columnCreateSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({
      required_error: "Column name is required",
      invalid_type_error: "Invalid value for column name",
    })
    .min(1, { message: "Column name is required" }),
  order: z
    .number({
      invalid_type_error: "Order must be a positive number",
      required_error: "Order is required",
    })
    .positive({ message: "Order must be a positive number" })
    .min(1, { message: "Order must be greater than or eqaul to 1" }),
  color: z
    .string({
      required_error: "Color is required",
      invalid_type_error: "Invalid value for column color",
    })
    .min(1, { message: "Color is required" }),
})

export const boardCreateSchema = z.object({
  name: z
    .string({
      required_error: "Board name is required",
      invalid_type_error: "Invalid value for board name",
    })
    .min(1, { message: "Board name is required" }),
  description: z
    .string({
      required_error: "Board description is required",
      invalid_type_error: "Invalid value for board description",
    })
    .min(1, { message: "Board description is required" }),
  columns: columnCreateSchema
    .array()
    .min(2, { message: "There must be at least 2 columns" })
    .max(4, { message: "There must be at most 4 columns" }),
})

export type BoardCreateInput = z.infer<typeof boardCreateSchema>
