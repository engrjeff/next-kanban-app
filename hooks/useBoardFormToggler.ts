import { create } from "zustand"

interface BoardFormToggleState {
  open: boolean
  toggle: (isOpen: boolean) => void
  openForm: () => void
  closeForm: () => void
}

const useBoardFormToggle = create<BoardFormToggleState>((set) => ({
  open: false,
  toggle: (isOpen) => set({ open: isOpen }),
  openForm: () => set({ open: true }),
  closeForm: () => set({ open: false }),
}))

export default useBoardFormToggle
