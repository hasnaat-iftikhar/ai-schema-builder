export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold">AI Schema Builder</h1>
      <p className="mt-4 text-xl">Build database schemas with AI assistance</p>
      <div className="mt-8 flex gap-4">
        <a href="/login" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Login
        </a>
        <a href="/signup" className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
          Sign Up
        </a>
      </div>
    </div>
  )
}
