import { NextResponse } from "next/server"

import db from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { id: string }
  }
) {
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
