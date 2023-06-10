import { Metadata } from "next"

import SignInForm from "./components/signin-form"

export const metadata: Metadata = {
  title: "Login",
}

function LoginPage() {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-8">
      <SignInForm />
    </div>
  )
}

export default LoginPage
