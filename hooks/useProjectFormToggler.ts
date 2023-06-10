import { create } from "zustand"

interface ProjectFormToggleState {
  open: boolean
  toggle: (isOpen: boolean) => void
  openForm: () => void
  closeForm: () => void
}

const useProjectFormToggle = create<ProjectFormToggleState>((set) => ({
  open: false,
  toggle: (isOpen) => set({ open: isOpen }),
  openForm: () => set({ open: true }),
  closeForm: () => set({ open: false }),
}))

export default useProjectFormToggle
