import { Metadata, ResolvingMetadata } from "next"

import TaskCard from "../components/TaskCard"
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
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-medium">Board</h2>
          <TaskForm project={project} />
        </div>
        <div className="flex flex-1 gap-6">
          {project.board.columns.map((column) => (
            <div
              key={column.id}
              className="min-w-[25%] flex-1 shrink-0 rounded-md bg-muted"
            >
              <div className="p-4">
                <h3 className="text-xs font-semibold text-muted-foreground">
                  {column.name}
                </h3>
              </div>
              <div className="space-y-3 px-4">
                {project.tasks
                  .filter((task) => task.columnId === column.id)
                  .map((taskItem) => (
                    <TaskCard
                      key={taskItem.id}
                      task={taskItem}
                      color={column.color}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectView
