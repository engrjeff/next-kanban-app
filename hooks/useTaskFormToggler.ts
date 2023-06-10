import { create } from "zustand"

interface TaskFormToggleState {
  open: boolean
  toggle: (isOpen: boolean) => void
  openForm: () => void
  closeForm: () => void
}

const useTaskFormToggle = create<TaskFormToggleState>((set) => ({
  open: false,
  toggle: (isOpen) => set({ open: isOpen }),
  openForm: () => set({ open: true }),
  closeForm: () => set({ open: false }),
}))

export default useTaskFormToggle
