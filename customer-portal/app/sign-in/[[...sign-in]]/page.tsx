import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">JDE Customer Portal</h1>
        <p className="text-slate-400 text-sm">Sign in to view your orders and documents</p>
      </div>
      <SignIn />
      <div className="mt-8 bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
        <p className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-4">Demo Accounts</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">Bell Textron</p>
              <p className="text-slate-400 text-xs">belltextron@demo.com</p>
            </div>
            <p className="text-slate-400 text-xs font-mono">Demo1234!</p>
          </div>
          <div className="border-t border-slate-800"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">SpaceX</p>
              <p className="text-slate-400 text-xs">spacex@demo.com</p>
            </div>
            <p className="text-slate-400 text-xs font-mono">Demo1234!</p>
          </div>
        </div>
      </div>
    </main>
  )
}
