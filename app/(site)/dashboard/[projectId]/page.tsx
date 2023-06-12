import { Metadata, ResolvingMetadata } from "next"

import EditProjectButton from "../components/EditProjectButton"
import TaskColumn from "../components/TaskColumn"
import TaskForm from "../components/TaskForm"
import { getProjectById } from "../services"

interface Props {
  params: { projectId: string }
}

export async function generateMetadata(
  { params }: Props,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const project = await getProjectById(params.projectId)

  return {
    title: project.name,
    description: project.description,
  }
}

async function ProjectView({ params }: Props) {
  const project = await getProjectById(params.projectId)

  return (
    <div className="flex h-full flex-col" key={params.projectId}>
      <div className="mb-6">
        <div className="flex gap-4">
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <EditProjectButton project={project} />
        </div>
        <p className="text-muted-foreground">{project.description}</p>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-medium">Board</h2>
          <TaskForm project={project} />
        </div>
        <div className="flex flex-1 gap-6">
          {project.board.columns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              tasks={project.tasks.filter(
                (task) => task.columnId === column.id
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectView
