import { Metadata } from "next"

import BoardCard from "./components/BoardCard"
import CreateBoardForm from "./components/CreateBoardForm"
import { getBoards } from "./services"

export const metadata: Metadata = {
  title: "Boards",
}

async function BoardsPage() {
  const boards = await getBoards()

  if (boards.length === 0) {
    return (
      <div className="w-full">
        <div>
          <h1 className="text-2xl font-bold">Boards</h1>
          <p className="text-muted-foreground">
            Boards are templates for your tasks
          </p>
        </div>
        <div className="space-y-4 py-20 text-center">
          <p className="text-muted-foreground">
            You don&apos;t have any board yet. Create one now.
          </p>
          <CreateBoardForm />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Boards</h1>
          <p className="text-muted-foreground">
            Boards are templates for your tasks
          </p>
        </div>
        <CreateBoardForm />
      </div>
      <ul className="mt-6 grid grid-cols-4 gap-4">
        {boards.map((board) => (
          <li key={board.id} className="min-w-[300px]">
            <BoardCard board={board} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BoardsPage
