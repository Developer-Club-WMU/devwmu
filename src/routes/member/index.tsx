import { assertMemberFn } from '@/server/helpers/route-protection'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/member/')({
  component: RouteComponent,
  beforeLoad: () => assertMemberFn(),
})

function RouteComponent() {
  return <div>Hello "/member/"!</div>
}
