import { NextResponse } from "next/server"

import db from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { projectUpdateSchema } from "@/app/(site)/dashboard/services/schema"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()

    const body = projectUpdateSchema.parse(json)

    const project = await db.project.update({
      where: {
        id: params.id,
      },
      data: body,
    })

    return NextResponse.json(project)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
