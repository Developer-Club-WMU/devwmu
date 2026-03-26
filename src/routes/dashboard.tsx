import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/server/helpers/route-protection'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const session = await getSession()
    
    // 1. Not logged in? Go to sign-in
    if (!session || !session.user) {
      throw redirect({
        to: '/sign-in',
      })
    }

    // 2. Admin? Go to Officer Dashboard
    if (session.user.role && /admin/.test(session.user.role)) {
      throw redirect({
        to: '/app',
      })
    }

    // 3. Regular Member? Go to Member Dashboard
    throw redirect({
      to: '/member',
    })
  },
})
