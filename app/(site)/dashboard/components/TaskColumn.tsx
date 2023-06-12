import { Column, Task } from "@prisma/client"

import AddTaskButton from "./AddTaskButton"
import TaskCard from "./TaskCard"

interface TaskColumnProps {
  column: Column
  tasks: Task[]
}

function TaskColumn({ column, tasks }: TaskColumnProps) {
  return (
    <div className="min-w-[25%] flex-1 shrink-0 rounded-md bg-muted">
      <div className="p-4">
        <div className="flex justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground">
            {column.name}
          </h3>
          <AddTaskButton columnId={column.id} columnName={column.name} />
        </div>
      </div>
      <div className="space-y-3 px-4">
        {tasks.map((taskItem) => (
          <TaskCard key={taskItem.id} task={taskItem} color={column.color} />
        ))}
      </div>
    </div>
  )
}

export default TaskColumn
