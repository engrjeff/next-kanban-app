import { NextResponse } from "next/server"

import db from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { taskCreateSchema } from "@/app/(site)/dashboard/services/schema"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const userId = user.id

    const json = await req.json()

    const body = taskCreateSchema.parse(json)

    const { title, content, columnId, projectId } = body

    const task = await db.task.create({
      data: {
        title,
        content,
        projectId,
        columnId,
        userId,
      },
    })

    return NextResponse.json(task)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
