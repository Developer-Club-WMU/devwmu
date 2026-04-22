import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import { z } from 'zod'
import { DbClient, DbClientLive } from '../../repositories/prisma.repository'
import { PrismaError } from '../../shared/errors'
import { assertOfficerFn } from '@/server/helpers/route-protection'

const listMembersInputSchema = z.object({
  searchTerm: z.string().trim().default(''),
  page: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(100).default(10),
})

export const listMembersFn = createServerFn()
  .inputValidator(listMembersInputSchema)
  .handler(async ({ data }) => {
    await assertOfficerFn()

    const program = Effect.gen(function* () {
      const dbClient = yield* DbClient
      const searchTerm = data.searchTerm.trim()

      const where = searchTerm
        ? {
            OR: [
              { name: { contains: searchTerm, mode: 'insensitive' as const } },
              { email: { contains: searchTerm, mode: 'insensitive' as const } },
            ],
          }
        : undefined

      const [members, total] = yield* Effect.tryPromise({
        try: () =>
          Promise.all([
            dbClient.user.findMany({
              where,
              orderBy: { createdAt: 'desc' },
              skip: data.page * data.pageSize,
              take: data.pageSize,
              select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                role: true,
                banned: true,
                banReason: true,
                banExpires: true,
                _count: {
                  select: {
                    eventAttendees: {
                      where: { attended: true },
                    },
                  },
                },
              },
            }),
            dbClient.user.count({ where }),
          ]),
        catch: () => new PrismaError({ message: 'Failed to fetch members' }),
      })

      return {
        members: members.map((member) => ({
          ...member,
          attendanceCount: member._count.eventAttendees,
        })),
        total,
      }
    })

    const runnable = program.pipe(Effect.provide(DbClientLive))
    try {
      const result = await Effect.runPromise(runnable)
      return { ok: true as const, data: result }
    } catch (error: any) {
      return { ok: false as const, error: error?.message || 'Unknown error' }
    }
  })

export type ListMembersFnShape = Awaited<ReturnType<typeof listMembersFn>>
export type ListMembersFnData = Extract<
  ListMembersFnShape,
  { ok: true }
>['data']
