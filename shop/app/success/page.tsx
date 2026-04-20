import Link from 'next/link'

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-6 bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
        <div className="w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold mb-2">Payment successful</h1>
        <p className="text-slate-400 text-sm mb-6">
          Thanks — your order has been recorded. This is a demo so no email is sent.
        </p>
        {sessionId && (
          <p className="font-mono text-xs text-slate-500 mb-6 break-all">Session: {sessionId}</p>
        )}
        <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-medium">
          Back to shop
        </Link>
      </div>
    </main>
  )
}
