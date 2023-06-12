import { Project } from "@prisma/client"
import { create } from "zustand"

interface CurrentProjectState {
  currentProject: Project | null
  setCurrentProject: (project: Project | null) => void
}

const useCurrentProject = create<CurrentProjectState>((set) => ({
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
}))

export default useCurrentProject
