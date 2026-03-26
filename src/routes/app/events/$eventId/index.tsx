import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEventFn } from '@/server/core/handlers/app/get-event.handler'
import { toggleAttendanceFn } from '@/server/core/handlers/app/toggle-attendance.handler'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  Edit2, 
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Info
} from 'lucide-react'
import { assertOfficerFn } from '@/server/helpers/route-protection'

export const Route = createFileRoute('/app/events/$eventId/')({
  component: EventDetailsPage,
  beforeLoad: () => assertOfficerFn(),
})

function EventDetailsPage() {
  const { eventId } = Route.useParams()
  const queryClient = useQueryClient()

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEventFn({ data: eventId }),
  })

  const { mutate: toggleAttendance } = useMutation({
    mutationFn: (args: { attendeeId: string; attended: boolean }) =>
      toggleAttendanceFn({ data: args }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId] })
      toast.success(variables.attended ? 'Member marked as attended' : 'Attendance record removed')
    },
    onError: (err: any) => {
      toast.error('Failed to update attendance: ' + err.message)
    },
  })

  if (isLoading) {
    return <div className="p-8 animate-pulse text-muted-foreground">Loading event details...</div>
  }

  if (error || !event) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 rounded-xl m-6">
        <XCircle className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl font-bold uppercase">Event Not Found</h2>
        <p className="mt-2 text-sm opacity-80 font-medium">This event may have been deleted or is inaccessible.</p>
        <Link to="/app/events">
          <Button variant="outline" className="mt-6">Back to Events</Button>
        </Link>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="container py-8 max-w-7xl mx-auto space-y-8">
      {/* Header / Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link 
            to="/app/events" 
            className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-2 uppercase"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Events
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tight uppercase">{event.title}</h1>
            <Badge className="font-bold">{event.status}</Badge>
          </div>
        </div>
        <Link to="/app/events/$eventId/edit" params={{ eventId }}>
          <Button className="font-bold uppercase tracking-widest px-8 shadow-lg shadow-primary/20">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-0 shadow-xl overflow-hidden bg-card/50 backdrop-blur-md">
            <div className="h-1 bg-primary w-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-black uppercase flex items-center gap-2 tracking-tight">
                <Calendar className="w-5 h-5 text-primary" /> Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-1">Time & Date</div>
                      <div className="font-bold text-lg">
                        {format(new Date(event.startTime), 'MMMM do, yyyy')}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-1">Location</div>
                      <div className="font-bold text-lg">{event.location || 'TBA'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-1">Attendance</div>
                      <div className="font-bold text-lg">
                        <span className="text-emerald-500">
                          {event.attendees?.filter((a: any) => a.attended).length || 0}
                        </span>
                        <span className="text-muted-foreground/30 mx-2 font-light">/</span>
                        {event._count?.attendees || 0} Registered
                      </div>
                      {event.capacity && (
                        <div className="text-sm text-muted-foreground font-medium">
                          Capacity: {event.capacity} seats
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {event.description && (
                <div className="border-t pt-8">
                  <div className="text-xs font-bold uppercase text-muted-foreground tracking-widest mb-4">Description</div>
                  <div className="prose prose-slate max-w-none text-muted-foreground font-medium leading-relaxed">
                    {event.description}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendees List */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" /> Registered Members
              </div>
              <Badge variant="outline" className="font-black">
                {event.attendees?.filter((a: any) => a.attended).length || 0} / {event.attendees?.length || 0} PRESENT
              </Badge>
            </h2>
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted uppercase">
                    <TableRow className="hover:bg-transparent text-muted-foreground uppercase">
                      <TableHead className="font-bold text-xs py-4">Member</TableHead>
                      <TableHead className="font-bold text-xs py-4">Email</TableHead>
                      <TableHead className="font-bold text-xs py-4 text-center">RSVP Date</TableHead>
                      <TableHead className="font-bold text-xs py-4 text-center">Status</TableHead>
                      <TableHead className="font-bold text-xs py-4 text-right">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {event.attendees?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-32 text-muted-foreground font-medium">
                          No members have registered for this event yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      event.attendees?.map((attendee: any) => (
                        <TableRow key={attendee.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {attendee.user.image ? (
                                <img src={attendee.user.image} alt={attendee.user.name} className="w-8 h-8 rounded-full border border-primary/20" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs border border-primary/20">
                                  {attendee.user.name.charAt(0)}
                                </div>
                              )}
                              <span className="font-bold text-slate-700">{attendee.user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground font-medium lowercase">
                            {attendee.user.email}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground font-medium text-center">
                            {format(new Date(attendee.rsvpAt), 'MMM do, yyyy')}
                          </TableCell>
                          <TableCell className="text-center">
                            {attendee.attended ? (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600 font-bold uppercase text-[10px]">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Attended
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="font-bold uppercase text-[10px]">
                                Registered
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Switch 
                              checked={attendee.attended} 
                              onCheckedChange={(checked) => {
                                toggleAttendance({ 
                                  attendeeId: attendee.id, 
                                  attended: !!checked 
                                })
                              }}
                              className="data-[state=checked]:bg-green-500"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </section>
        </div>

        {/* Right Column: Mini Stats / Meta */}
        <div className="space-y-8">
          <Card className="border-primary/20 bg-slate-50 dark:bg-slate-900/50 shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-primary/10">
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center justify-between">
                Quick Stats
                <Users className="w-5 h-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-2 tracking-widest text-muted-foreground uppercase">
                  <span className="text-xs font-black">Growth</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 cursor-help hover:text-primary transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px] text-xs font-bold leading-snug">
                      Total number of registered members for this event.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-2xl font-black text-primary">+{event._count?.attendees || 0}</span>
              </div>
              
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-2 tracking-widest text-muted-foreground uppercase">
                  <span className="text-xs font-black">Attendance</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 cursor-help hover:text-primary transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px] text-xs font-bold leading-snug">
                      Confirmed participants relative to total spots.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="text-lg font-black">
                  {event.capacity ? `${Math.round(((event._count?.attendees || 0) / event.capacity) * 100)}%` : '100%'}
                </span>
              </div>

              <div className="pt-2 space-y-4">
                <div className="flex items-center justify-between tracking-widest text-muted-foreground uppercase">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black">Registration Velocity</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 cursor-help hover:text-primary transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[200px] text-xs font-bold leading-snug">
                        The current rate of new registrations over the last period.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500">Normal</span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-primary/5">
                  <div className="h-full bg-primary rounded-full w-3/4 animate-pulse-slow shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-lg font-black uppercase">Technical Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Visibility</span>
                <span className="font-bold">{event.isPublic ? 'Public' : 'Private'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Created ID</span>
                <code className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono">{event.createdById}</code>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Record ID</span>
                <code className="bg-muted px-2 py-0.5 rounded text-[10px] font-mono">{event.id}</code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </TooltipProvider>
  )
}
