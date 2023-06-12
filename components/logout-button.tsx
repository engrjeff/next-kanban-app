"use client"

import { signOut, useSession } from "next-auth/react"

import { Button } from "./ui/button"

function LogoutButton() {
  const session = useSession()

  if (session.data?.user) return null

  return (
    <Button
      variant="secondary"
      className="ml-auto"
      size="sm"
      onClick={() => signOut()}
    >
      Log Out
    </Button>
  )
}

export default LogoutButton
