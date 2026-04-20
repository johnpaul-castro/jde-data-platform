import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">JDE Customer Portal</h1>
        <p className="text-slate-400 text-sm">Sign in to view your orders and documents</p>
      </div>
      <SignIn />
    </main>
  )
}
