import { create } from "zustand"

import { Board } from "@/app/(site)/boards/services"

interface CurrentBoardState {
  currentBoard: Board | null
  setCurrentBoard: (board: Board | null) => void
}

const useCurrentBoard = create<CurrentBoardState>((set) => ({
  currentBoard: null,
  setCurrentBoard: (board) => set({ currentBoard: board }),
}))

export default useCurrentBoard
