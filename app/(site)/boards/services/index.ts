import { redirect } from "next/navigation"
import { Board as RawBoard } from "@prisma/client"

import { API_ENDPOINTS, apiClient } from "@/lib/apiClient"
import db from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

import { type BoardCreateInput } from "./schema"

export const createBoard = async (boardData: BoardCreateInput) => {
  const response = await apiClient.post<RawBoard>(
    API_ENDPOINTS.BOARDS,
    boardData
  )

  return response.data
}

export const updateBoard = async (id: string, boardData: BoardCreateInput) => {
  const url = API_ENDPOINTS.BOARDS + `/${id}`
  const response = await apiClient.put<RawBoard>(url, boardData)

  return response.data
}

export const deleteBoard = async (id: string) => {
  const url = API_ENDPOINTS.BOARDS + `/${id}`
  const response = await apiClient.delete(url)

  return response.data
}

export const getBoards = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const userId = user.id

  const boards = await db.board.findMany({
    where: {
      userId,
    },
    include: {
      projects: true,
      columns: {
        orderBy: {
          order: "asc",
        },
        include: {
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return boards
}

export type Board = Awaited<ReturnType<typeof getBoards>>[number]
