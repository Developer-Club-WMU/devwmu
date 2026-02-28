import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppHeader } from '@/components/AppHeader'

export const Route = createFileRoute('/app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
