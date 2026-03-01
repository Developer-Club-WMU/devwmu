import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import { EventService, EventServiceLayer } from '../../domain/events.service'
import { z } from 'zod'
import { EventStatus } from 'generated/enums'

/**
 * upsertEventSchema
 *
 * This schema validates input coming from the client.
 *
 * Why this exists:
 * - Prevents invalid data from reaching the domain layer
 * - Ensures type safety at runtime
 * - Protects against malformed or malicious requests
 *
 * Important:
 * We validate only the Event "data" payload,
 * not full Prisma args. The handler wraps it correctly.
 */
export const upsertEventSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1),

    description: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    location: z.string().nullable().optional(),

    // Accepts ISO strings and converts them into Date
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),

    status: z.enum(EventStatus).optional(),

    capacity: z.number().int().positive().nullable().optional(),
    isPublic: z.boolean().optional(),

    createdById: z.string().min(1),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })

/**
 * upsertEventFn
 *
 * This is the server boundary.
 *
 * Responsibilities of this layer:
 * 1. Validate input
 * 2. Construct the Effect program
 * 3. Provide all required layers
 * 4. Execute the program
 *
 * Important architectural rule:
 * Services do NOT execute effects.
 * Handlers (boundaries) execute effects.
 */
export const upsertEventFn = createServerFn()
  .inputValidator(upsertEventSchema)
  .handler(async ({ data }) => {
    /**
     * Step 1 — Build an Effect program.
     *
     * This program:
     * - Requests EventService from the environment
     * - Calls the upsertEvent method
     *
     * At this stage, nothing has executed yet.
     */
    const program = Effect.gen(function* () {
      const service = yield* EventService

      const { id, ...eventData } = data

      return yield* service.upsertEvent({
        id,
        data: eventData,
      })
    })

    /**
     * Step 3 — Provide the constructed layer
     * to the program.
     *
     * After this step, the program no longer
     * requires any environment (R = never).
     */
    const runnable = program.pipe(Effect.provide(EventServiceLayer))

    /**
     * Step 4 — Execute the Effect.
     *
     * runPromise should ONLY be called
     * at the outermost boundary (like a server handler).
     */
    return Effect.runPromise(runnable)
  })
