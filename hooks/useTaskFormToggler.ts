import { create } from "zustand"

interface TaskFormToggleState {
  initialColumn: string | null
  setInitialColumn: (col: string | null) => void
  open: boolean
  toggle: (isOpen: boolean) => void
  openForm: () => void
  closeForm: () => void
}

const useTaskFormToggle = create<TaskFormToggleState>((set) => ({
  initialColumn: null,
  setInitialColumn: (col) => set({ initialColumn: col }),
  open: false,
  toggle: (isOpen) => set({ open: isOpen }),
  openForm: () => set({ open: true }),
  closeForm: () => set({ open: false }),
}))

export default useTaskFormToggle
