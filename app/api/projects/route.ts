import { NextResponse } from "next/server"

import db from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { projectCreateSchema } from "@/app/(site)/dashboard/services/schema"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const userId = user.id

    const json = await req.json()

    const body = projectCreateSchema.parse(json)

    const { name, description, boardId } = body

    const project = await db.project.create({
      data: {
        name,
        description,
        boardId,
        userId,
      },
    })

    return NextResponse.json(project)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
