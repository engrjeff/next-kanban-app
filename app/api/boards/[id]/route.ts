import { NextResponse } from "next/server"

import db from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { boardCreateSchema } from "@/app/(site)/boards/services/schema"

type IdParams = { params: { id: string } }

export async function PUT(req: Request, { params }: IdParams) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const json = await req.json()

    const { columns, ...board } = boardCreateSchema.parse(json)

    const updatedBoard = await db.board.update({
      where: {
        id: params.id,
      },
      data: board,
    })

    // update the columns
    const updatedColumns = await Promise.all(
      columns.map(async (col) => {
        if (col.id) {
          // means update
          return db.column.update({
            where: {
              id: col.id,
            },
            data: col,
          })
        }

        // create
        return db.column.create({
          data: {
            name: col.name,
            order: col.order,
            color: col.color,
            userId: user.id,
          },
        })
      })
    ).then((values) => values)

    return NextResponse.json(updatedBoard)
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: IdParams) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    await db.board.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ success: true, deletedId: params.id })
  } catch (error: any) {
    return new NextResponse(error.message || "Error", { status: 500 })
  }
}
