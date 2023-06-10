import { type ReactNode } from "react"

function ErrorMessage({ children }: { children: ReactNode }) {
  return <p className="text-sm text-red-600">{children}</p>
}

export default ErrorMessage
