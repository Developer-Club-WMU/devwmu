import { assertAuthenticatedFn } from '@/server/helpers/route-protection'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
  beforeLoad: () => assertAuthenticatedFn(),
})

function RouteComponent() {
  return <div>Hello "/app/"!</div>
}
