import { betterAuth } from 'better-auth'
import { admin } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@/db'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  baseURL: process.env.BETTER_AUTH_URL as string,
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  plugins: [
    admin({
      defaultRole: 'admin',
    }),
    tanstackStartCookies(),
  ],
})
