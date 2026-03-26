import { Context, Effect, Layer } from 'effect'
import type { Event } from 'generated/client'
import { DbClient, DbClientLive } from '../repositories/prisma.repository'
import { PrismaError, NotFoundError } from '../shared/errors'

/**
 * EventService Tag
 *
 * This tag represents the EventService in the Effect dependency graph.
 *
 * A Tag acts as an identifier for a service implementation.
 * It allows other parts of the application to "request" this service
 * without knowing how it is built.
 */
export class EventService extends Context.Tag('EventService')<
  EventService,
  EventServiceMethods
>() {}

/**
 * EventServiceMethods
 *
 * This interface defines the public API of the service.
 *
 * Important:
 * The method does NOT expose DbClient in its environment.
 *
 * That means consumers of EventService do not need to know
 * anything about Prisma or database access.
 *
 * This keeps layering clean and prevents dependency leakage.
 */
interface EventServiceMethods {
  readonly upsertEvent: (args: {
    data: any
    id?: string
  }) => Effect.Effect<Event, PrismaError>

  readonly listEvents: (args?: {
    userId?: string
  }) => Effect.Effect<any[], PrismaError>

  readonly getEventById: (
    id: string,
  ) => Effect.Effect<Event, PrismaError | NotFoundError>

  readonly getPublicEvents: (args?: {
    userId?: string
  }) => Effect.Effect<
    { upcoming: any[]; past: any[]; ongoing: any[] },
    PrismaError
  >
  readonly getPublicEventById: (
    id: string,
  ) => Effect.Effect<Event, PrismaError | NotFoundError>

  readonly rsvpEvent: (args: {
    eventId: string
    userId: string
    status: boolean
  }) => Effect.Effect<any, PrismaError>
}

/**
 * EventServiceLive
 *
 * This Layer constructs the concrete implementation of EventService.
 *
 * Key Concept:
 * - DbClient is resolved at layer construction time.
 * - The returned methods close over dbClient.
 * - Therefore, DbClient is NOT required when calling upsertEvent.
 *
 * This pattern prevents leaking infrastructure dependencies
 * into higher layers of the application.
 */
export const EventServiceLive = Layer.effect(
  EventService,
  Effect.gen(function* () {
    /**
     * Resolve DbClient once when the layer is built.
     *
     * This means:
     * - The service depends on DbClient
     * - But the methods themselves do NOT require it in their environment
     */
    const dbClient = yield* DbClient

    return {
      /**
       * Creates (or inserts) an event in the database.
       *
       * Any Prisma error is mapped to a domain-level PrismaError.
       */
      upsertEvent: ({ data, id }) =>
        Effect.tryPromise({
          try: () => {
            if (id) {
              return dbClient.event.update({
                where: { id },
                data,
              })
            }
            return dbClient.event.create({
              data,
            })
          },
          catch: () =>
            new PrismaError({
              message: 'Failed to upsert event',
            }),
        }),

      /**
       * Lists all events ordered by start time.
       */
      listEvents: (args) =>
        Effect.tryPromise({
          try: () =>
            dbClient.event.findMany({
              orderBy: { startTime: 'asc' },
              include: {
                _count: {
                  select: { attendees: true },
                },
                attendees: args?.userId
                  ? {
                      where: { userId: args.userId },
                    }
                  : false,
              },
            }),
          catch: () =>
            new PrismaError({
              message: 'Failed to fetch events',
            }),
        }),

      /**
       * Gets a specific event by ID.
       */
      getEventById: (id) =>
        Effect.tryPromise({
          try: () => dbClient.event.findUnique({ where: { id } }),
          catch: () =>
            new PrismaError({
              message: 'Database error fetching event',
            }),
        }).pipe(
          Effect.flatMap((event) =>
            event
              ? Effect.succeed(event)
              : Effect.fail(new NotFoundError({ message: 'Event not found' })),
          ),
        ),

      getPublicEvents: (args) =>
        Effect.tryPromise({
          try: async () => {
            const now = new Date()
            const include = {
              _count: {
                select: { attendees: true },
              },
              attendees: args?.userId
                ? {
                    where: { userId: args.userId },
                  }
                : false,
            }

            const [ongoing, upcoming, past] = await Promise.all([
              dbClient.event.findMany({
                where: {
                  status: 'PUBLISHED',
                  isPublic: true,
                  startTime: { lte: now },
                  endTime: { gte: now },
                },
                orderBy: { startTime: 'asc' },
                include,
              }),
              dbClient.event.findMany({
                where: {
                  status: 'PUBLISHED',
                  isPublic: true,
                  startTime: { gt: now },
                },
                orderBy: { startTime: 'asc' },
                include,
              }),
              dbClient.event.findMany({
                where: {
                  status: 'PUBLISHED',
                  isPublic: true,
                  endTime: { lt: now },
                },
                orderBy: { endTime: 'desc' },
                take: 10,
                include,
              }),
            ])
            return { ongoing, upcoming, past }
          },
          catch: () =>
            new PrismaError({ message: 'Failed to fetch public events' }),
        }),

      getPublicEventById: (id) =>
        Effect.tryPromise({
          try: () =>
            dbClient.event.findFirst({
              where: { id, status: 'PUBLISHED', isPublic: true },
            }),
          catch: () =>
            new PrismaError({
              message: 'Database error fetching public event',
            }),
        }).pipe(
          Effect.flatMap((event) =>
            event
              ? Effect.succeed(event)
              : Effect.fail(
                  new NotFoundError({
                    message: 'Event not found or not public',
                  }),
                ),
          ),
        ),

      /**
       * RSVPs to an event for a specific user.
       */
      rsvpEvent: ({ eventId, userId, status }) =>
        Effect.tryPromise({
          try: () => {
            if (status) {
              return dbClient.eventAttendee.upsert({
                where: {
                  eventId_userId: {
                    eventId,
                    userId,
                  },
                },
                create: {
                  eventId,
                  userId,
                },
                update: {},
              })
            }
            return dbClient.eventAttendee.delete({
              where: {
                eventId_userId: {
                  eventId,
                  userId,
                },
              },
            })
          },
          catch: (_e: any) => {
            return new PrismaError({ message: 'Failed to update RSVP' })
          },
        }),
    }
  }),
)

/**
 * Construct the event service layer.
 *
 * EventServiceLive depends on DbClientLive.
 *
 * We use Layer.provide because:
 * - EventServiceLive requires DbClient
 */
export const EventServiceLayer = EventServiceLive.pipe(
  Layer.provide(DbClientLive),
)
