import axios from "axios"

const API_URL = process.env.API_URL

export const API_ENDPOINTS = {
  ROOT: API_URL,
  BOARDS: "/api/boards",
  PROJECTS: "/api/projects",
  TASKS: "/api/tasks",
}

export const apiClient = axios.create({
  baseURL: API_URL,
})
