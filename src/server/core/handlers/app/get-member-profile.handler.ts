import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import { DbClient, DbClientLive } from '../../repositories/prisma.repository'
import { PrismaError, NotFoundError } from '../../shared/errors'
import { z } from 'zod'

export const getMemberProfileFn = createServerFn()
  .inputValidator(z.string())
  .handler(async ({ data: userId }) => {
    const program = Effect.gen(function* () {
      const dbClient = yield* DbClient

      const user = yield* Effect.tryPromise({
        try: () =>
          dbClient.user.findUnique({
            where: { id: userId },
            include: {
              eventAttendees: {
                where: { attended: true },
                include: {
                  event: {
                    include: {
                      eventTagOnEvents: {
                        include: { tag: true },
                      },
                    },
                  },
                },
                orderBy: {
                  event: {
                    startTime: 'desc',
                  },
                },
              },
            },
          }),
        catch: () => new PrismaError({ message: 'Failed to fetch user' }),
      })

      if (!user) {
        return yield* Effect.fail(
          new NotFoundError({ message: 'Member not found' }),
        )
      }

      return user
    })

    const runnable = program.pipe(Effect.provide(DbClientLive))
    try {
      const result = await Effect.runPromise(runnable)
      return { ok: true as const, data: result }
    } catch (error: any) {
      return { ok: false as const, error: error?.message || 'Unknown error' }
    }
  })

export type GetMemberProfileFnShape = Awaited<
  ReturnType<typeof getMemberProfileFn>
>
export type GetMemberProfileFnData = Extract<
  GetMemberProfileFnShape,
  { ok: true }
>['data']
