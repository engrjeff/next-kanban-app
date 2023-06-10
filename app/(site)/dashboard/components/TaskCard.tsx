import { Task } from "@prisma/client"

import { cn } from "@/lib/utils"

interface TaskCardProps {
  color: string
  task: Task
}

function TaskCard({ color, task }: TaskCardProps) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-md bg-background p-3")}
    >
      <div className={cn("absolute inset-y-0 left-0 w-1", color)}></div>
      <h4 className="mb-2 text-sm font-medium">{task.title}</h4>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {task.content}
      </p>
    </div>
  )
}

export default TaskCard
