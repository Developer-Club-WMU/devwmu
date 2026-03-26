import { auth } from '@/lib/auth'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

export const getSession = createServerFn().handler(async () => {
  const headers = getRequestHeaders()
  return auth.api.getSession({ headers })
})

export const assertSessionFn = createServerFn().handler(async () => {
  const session = await getSession()
  if (
    session &&
    session.session &&
    session.user.role &&
    /admin/.test(session.user.role)
  )
    throw redirect({ to: '/app' })
  else if (
    session &&
    session.session &&
    session.user.role &&
    /user/.test(session.user.role)
  )
    throw redirect({ to: '/member' })
})

export const assertAuthenticatedFn = createServerFn().handler(async () => {
  const session = await getSession()
  if (!session || !session.user || !session.session)
    throw redirect({ to: '/sign-in' })
  return session
})

export const assertOfficerFn = createServerFn().handler(async () => {
  const session = await assertAuthenticatedFn()
  if (session?.user.role && !/admin/.test(session.user.role))
    throw redirect({ to: '/unauthorized' })
  return session
})

export const assertMemberFn = createServerFn().handler(async () => {
  const session = await assertAuthenticatedFn()
  if (session?.user.role && !/user/.test(session.user.role))
    throw redirect({ to: '/unauthorized' })
  return session
})
