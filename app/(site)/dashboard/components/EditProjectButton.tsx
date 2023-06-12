"use client"

import { Project } from "@prisma/client"
import { Edit2 } from "lucide-react"

import useCurrentProject from "@/hooks/useCurrentProject"
import useProjectFormToggle from "@/hooks/useProjectFormToggler"
import { Button } from "@/components/ui/button"

interface EditProjectButtonProps {
  project: Project
}

function EditProjectButton({ project }: EditProjectButtonProps) {
  const setCurrentProject = useCurrentProject(
    (state) => state.setCurrentProject
  )
  const openForm = useProjectFormToggle((state) => state.openForm)

  const handleClick = () => {
    setCurrentProject(project)

    openForm()
  }

  return (
    <Button variant="secondary" className="h-7 w-7 p-0" onClick={handleClick}>
      <Edit2 className="h-4 w-4" />
      <span className="sr-only">Edit project</span>
    </Button>
  )
}

export default EditProjectButton
