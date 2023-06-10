import { type ReactNode } from "react"

function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container flex h-[calc(100vh-100px)] py-4">{children}</div>
  )
}

export default HomeLayout
