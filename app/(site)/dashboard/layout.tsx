import { type ReactNode } from "react"

import { getBoards } from "../boards/services"
import ProjectForm from "./components/ProjectForm"
import ProjectLink from "./components/ProjectLink"
import { getProjects } from "./services"

async function DashboardLayout({ children }: { children: ReactNode }) {
  const [boards, projects] = await Promise.all([getBoards(), getProjects()])

  return (
    <div className="flex w-full gap-6">
      <div className="w-[240px] border-r pr-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <ProjectForm boards={boards} />
        </div>
        <ul className="mt-4 space-y-2">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectLink id={project.id} name={project.name} />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default DashboardLayout
