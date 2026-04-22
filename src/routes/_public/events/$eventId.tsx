import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPublicEventByIdFn } from '@/server/core/handlers/public/get-public-event-by-id.handler'
import { rsvpEventFn } from '@/server/core/handlers/app/rsvp-event.handler'
import { authClient } from '@/lib/auth-client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, MapPin, UserPlus, Check, Users } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_public/events/$eventId')({
  component: PublicEventDetailsPage,
})

function PublicEventDetailsPage() {
  const { eventId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()
  const userId = session?.user?.id

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['public-event', eventId, userId],
    queryFn: () => getPublicEventByIdFn({ data: { id: eventId, userId } }),
  })

  const { mutate: toggleRSVP, isPending: isRsvpPending } = useMutation({
    mutationFn: (args: { eventId: string; status: boolean }) =>
      rsvpEventFn({ data: { ...args, userId: userId! } }),
    onSuccess: (_, variables) => {
      toast.success(variables.status ? 'See you there!' : 'RSVP removed')
      queryClient.invalidateQueries({ queryKey: ['public-event', eventId] })
    },
    onError: (err: any) => toast.error('Failed to update RSVP: ' + err.message),
  })

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading event details...</div>
  }

  if (error || !event) {
    return (
      <div className="p-12 text-center text-destructive">
        Failed to load event. It may have been removed or is not currently public.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-public-bg font-sans selection:bg-public-accent/30 pt-32 md:pt-48 pb-24 relative overflow-hidden text-slate-300">
      {/* Abstract atmospheric glow */}
      <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-public-glow/20 blur-[120px] pointer-events-none"></div>
      
      <div className="container relative mx-auto px-6 max-w-4xl z-10">
      <Link 
        to="/events" 
        className="inline-flex items-center text-sm font-bold tracking-widest uppercase text-slate-500 hover:text-public-accent mb-10 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Link>
      
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">
          {event.title}
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-slate-400 font-medium mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-public-accent" />
            <span className="text-slate-300">
              {format(new Date(event.startTime), 'EEEE, MMMM do yyyy - h:mm a')}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-public-accent" />
              <span className="text-slate-300">
                {event.location}
              </span>
            </div>
          )}
        </div>

        {new Date() <= new Date(event.endTime) && (() => {
          const isGoing = (event as any).attendees?.length > 0
          return (
            <div className="flex items-center gap-6">
              <button
                className={`inline-flex items-center gap-2 px-6 py-3 font-black uppercase text-[11px] tracking-[0.2em] transition-all border ${
                  isGoing
                    ? 'bg-transparent text-public-accent border-public-accent hover:bg-public-accent/10'
                    : 'bg-public-accent text-public-bg border-public-accent hover:bg-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isRsvpPending}
                onClick={() => {
                  if (!userId) {
                    navigate({ to: '/sign-in' })
                    return
                  }
                  toggleRSVP({ eventId: event.id, status: !isGoing })
                }}
              >
                {isGoing ? (
                  <><Check className="w-3.5 h-3.5" /> Going</>
                ) : (
                  <><UserPlus className="w-3.5 h-3.5" /> RSVP</>
                )}
              </button>
              {(event as any)._count?.attendees != null && (
                <span className="flex items-center gap-1.5 text-slate-500 font-bold text-xs uppercase tracking-widest">
                  <Users className="w-4 h-4 text-public-accent/70" />
                  {(event as any)._count.attendees} Attending
                </span>
              )}
            </div>
          )
        })()}
      </div>

      <div className="mt-8">
        {event.content ? (
          <div
            data-color-mode="dark"
            className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-p:text-slate-300 prose-li:text-slate-300 prose-a:text-public-accent hover:prose-a:text-public-accent/80"
          >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
            >
              {event.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-slate-500 italic p-8 border border-public-border bg-public-card/30 rounded-xl backdrop-blur-sm text-center">
            Check back later for full event details!
            <p className="not-italic font-medium mt-4 text-slate-400">{event.description}</p>
          </div>
        )}
      </div>
    </div>
  </div>
  )
}
