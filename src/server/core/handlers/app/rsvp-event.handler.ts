import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import { EventService, EventServiceLayer } from '../../domain/events.service'
import { z } from 'zod'

export const rsvpEventSchema = z.object({
  eventId: z.string().min(1),
  userId: z.string().min(1),
  status: z.boolean(),
})

export const rsvpEventFn = createServerFn()
  .inputValidator(rsvpEventSchema)
  .handler(async ({ data }) => {
    const program = Effect.gen(function* () {
      const service = yield* EventService
      return yield* service.rsvpEvent(data)
    })

    const runnable = program.pipe(Effect.provide(EventServiceLayer))
    try {
      const result = await Effect.runPromise(runnable)
      return { ok: true as const, data: result }
    } catch (error: any) {
      return { ok: false as const, error: error?.message || 'Unknown error' }
    }
  })

export type RSVPEventFnShape = Awaited<ReturnType<typeof rsvpEventFn>>
export type RSVPEventFnData = Extract<RSVPEventFnShape, { ok: true }>['data']
