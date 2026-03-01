import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { listEventsFn } from '@/server/core/handlers/app/list-events.handler'
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
import { Edit2, Plus } from 'lucide-react'
import { EventStatus } from 'generated/enums'

export const Route = createFileRoute('/app/events/')({
  component: EventsTablePage,
})

function getStatusBadgeVariant(status: EventStatus) {
  switch (status) {
    case EventStatus.DRAFT:
      return 'secondary'
    case EventStatus.REVIEW:
      return 'outline'
    case EventStatus.APPROVED:
      return 'default'
    case EventStatus.PUBLISHED:
      return 'default' // Add success later if needed
    case EventStatus.CANCELLED:
      return 'destructive'
    case EventStatus.COMPLETED:
      return 'outline'
    default:
      return 'default'
  }
}

function EventsTablePage() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => listEventsFn(),
  })

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Manage club events and workshops.</p>
        </div>
        <Link to="/app/events/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Loading events...
                </TableCell>
              </TableRow>
            ) : events?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No events found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              events?.map((event: any) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(event.status as EventStatus)}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(event.startTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(event.endTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      to="/app/events/$eventId"
                      params={{ eventId: event.id }}
                    >
                      <Button variant="ghost" size="icon">
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
