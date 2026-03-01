import { Data } from 'effect'

interface ErrorShape {
  message?: string
}

export class PrismaError extends Data.TaggedError('Data')<ErrorShape> {}
