import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getPublicEventByIdFn } from '@/server/core/handlers/public/get-public-event-by-id.handler'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'

export const Route = createFileRoute('/_public/events/$eventId')({
  component: PublicEventDetailsPage,
})

function PublicEventDetailsPage() {
  const { eventId } = Route.useParams()

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['public-event', eventId],
    queryFn: () => getPublicEventByIdFn({ data: eventId }),
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
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-slate-400 font-medium">
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
