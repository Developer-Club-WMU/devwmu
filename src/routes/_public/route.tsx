import { createFileRoute, Outlet } from '@tanstack/react-router'
import { NavBar } from '@/components/NavBar'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}
