export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome to the AI Schema Builder dashboard.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-cryptic-card p-6 rounded-lg border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <p className="text-white/70 mb-4">Create and manage your database schema projects</p>
          <a href="/dashboard/projects" className="text-cryptic-accent hover:underline">
            View projects →
          </a>
        </div>
        <div className="bg-cryptic-card p-6 rounded-lg border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Community</h2>
          <p className="text-white/70 mb-4">Explore community templates and shared schemas</p>
          <a href="/dashboard/community" className="text-cryptic-accent hover:underline">
            Browse community →
          </a>
        </div>
        <div className="bg-cryptic-card p-6 rounded-lg border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-white/70 mb-4">Configure your account and preferences</p>
          <a href="/dashboard/settings" className="text-cryptic-accent hover:underline">
            Manage settings →
          </a>
        </div>
      </div>
    </div>
  )
}
