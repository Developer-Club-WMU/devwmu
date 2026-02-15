import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/db'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  baseURL: process.env.BETTER_AUTH_URL as string,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  plugins: [tanstackStartCookies()],
})
