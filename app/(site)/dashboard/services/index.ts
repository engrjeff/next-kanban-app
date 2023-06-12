import { notFound, redirect } from "next/navigation"
import { Project as RawProject, Task } from "@prisma/client"

import { API_ENDPOINTS, apiClient } from "@/lib/apiClient"
import db from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

import {
  ProjectUpdateInput,
  TaskCreateInput,
  type ProjectCreateInput,
} from "./schema"

export const createProject = async (projectData: ProjectCreateInput) => {
  const response = await apiClient.post<RawProject>(
    API_ENDPOINTS.PROJECTS,
    projectData
  )

  return response.data
}

export const updateProject = async (
  id: string,
  projectData: ProjectUpdateInput
) => {
  const url = API_ENDPOINTS.PROJECTS + `/${id}`
  const response = await apiClient.put<RawProject>(url, projectData)

  return response.data
}

export const getProjects = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const userId = user.id

  const projects = await db.project.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return projects
}

export const getProjectById = async (id: string) => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const userId = user.id

  const project = await db.project.findFirst({
    where: {
      userId,
      AND: {
        id,
      },
    },
    include: {
      board: {
        include: {
          columns: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      tasks: true,
    },
  })

  if (!project) {
    return notFound()
  }

  return project
}

// TASKS

export const createTask = async (taskData: TaskCreateInput) => {
  const response = await apiClient.post<Task>(API_ENDPOINTS.TASKS, taskData)

  return response.data
}

export type Project = Awaited<ReturnType<typeof getProjectById>>
