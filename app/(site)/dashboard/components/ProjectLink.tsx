"use client"

import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function ProjectLink({ id, name }: { id: string; name: string }) {
  const segment = useSelectedLayoutSegment()
  const isActive = id === segment
  return (
    <Link
      href={`/dashboard/${id}`}
      className={cn(
        buttonVariants({ variant: isActive ? "default" : "ghost" }),
        "w-full justify-start rounded-full"
      )}
    >
      {name}
    </Link>
  )
}

export default ProjectLink
