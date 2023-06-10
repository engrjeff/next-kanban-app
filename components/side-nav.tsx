import Link from "next/link"

import { buttonVariants } from "./ui/button"

function SideNav() {
  return (
    <nav className="h-full w-[240px] border-r">
      <Link className={buttonVariants({ variant: "ghost" })} href="/boards">
        Boards
      </Link>
    </nav>
  )
}

export default SideNav
