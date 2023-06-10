"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

import { Button } from "./ui/button"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const session = useSession()

  const isAuthenticated = session.status === "authenticated"
  const segment = useSelectedLayoutSegments()

  return (
    <div className="flex flex-1 gap-6 pr-4 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    { "text-foreground": segment.length === 0 }
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
          {!isAuthenticated ? (
            <Link
              href="/signin"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground"
              )}
            >
              Log In
            </Link>
          ) : (
            <>
              {siteConfig.appNav.map((nav) => (
                <Link
                  key={nav.title}
                  href={nav.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    {
                      "text-foreground": segment?.includes(
                        nav.href.substring(1)
                      ),
                    }
                  )}
                >
                  {nav.title}
                </Link>
              ))}
            </>
          )}
        </nav>
      ) : null}

      <Button
        variant="secondary"
        className="ml-auto"
        size="sm"
        onClick={() => signOut()}
      >
        Log Out
      </Button>
    </div>
  )
}
