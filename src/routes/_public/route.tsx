import { createFileRoute, Outlet } from '@tanstack/react-router'
import { NavBar } from '@/components/NavBar'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="min-h-screen bg-public-bg text-public-fg selection:bg-public-accent/30 font-sans antialiased">
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
