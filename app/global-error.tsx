"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500">Something went wrong globally</h1>
        <p className="mt-4 text-gray-400">{error?.message || "An unknown error occurred"}</p>
        {error?.digest && <p className="mt-2 text-sm text-gray-500">Error ID: {error.digest}</p>}
        <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" onClick={() => reset()}>
          Try again
        </button>
      </body>
    </html>
  )
}
