import { NextResponse } from "next/server"

import db from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { boardCreateSchema } from "@/app/(site)/boards/services/schema"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const userId = user.id

    const json = await req.json()

    const body = boardCreateSchema.parse(json)

    const { name, description, columns } = body

    const board = await db.board.create({
      data: {
        name,
        description,
        userId,
        columns: {
          createMany: {
            data: columns.map((col) => ({
              ...col,
              userId,
            })),
          },
        },
      },
      include: {
        columns: true,
      },
    })

    return NextResponse.json(board)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
