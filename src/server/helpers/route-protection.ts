import { auth } from '@/lib/auth'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const getSession = createServerFn().handler(async () => {
  const headers = getRequestHeaders()
  return auth.api.getSession({ headers })
})

export const assertAuthenticatedFn = createServerFn().handler(async () => {
  const session = await getSession()
  if (!session || !session.user || !session.session)
    throw redirect({ to: '/sign-in' })
  return session
})
