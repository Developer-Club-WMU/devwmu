import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { upsertEventFn } from '@/server/core/handlers/app/upsert-event.handler'
import { getEventFn } from '@/server/core/handlers/app/get-event.handler'
import { EventForm } from '@/components/events/EventForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/app/events/$eventId/edit/')({
  component: EditEventPage,
})

function EditEventPage() {
  const { eventId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { data: session } = authClient.useSession()

  const { data: response, isLoading } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEventFn({ data: eventId }),
  })

  const { mutateAsync: updateEvent } = useMutation({
    mutationFn: (values: any) => 
      upsertEventFn({ data: values }),
    onSuccess: (res: any) => {
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['events'] })
        queryClient.invalidateQueries({ queryKey: ['events', eventId] })
        toast.success('Event updated successfully')
        navigate({ to: '/app/events' })
      } else {
        toast.error('Failed to update event: ' + res.error)
      }
    },
    onError: (err: any) => {
      toast.error('Failed to update event: ' + err.message)
    },
  })

  // Loading states
  if (isLoading || !session) {
    return <div className="p-8 text-center">Loading event details...</div>
  }

  const event = response?.ok ? response.data : null

  // Error states
  if (!event) {
    return (
      <div className="p-8 text-center text-destructive">
        {response?.ok === false ? response.error : 'Failed to load event. It may have been deleted or you don\'t have permission to view it.'}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Event</CardTitle>
          <CardDescription>
            Update the details for {event.title}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm
            userId={session.user.id}
            defaultValues={{
              ...event,
              // Convert stored ISO strings/Date objects into JS Date instances for the form
              startTime: new Date(event.startTime),
              endTime: new Date(event.endTime),
            }}
            onSubmit={async (values) => {
              await updateEvent({
                ...values,
                id: event.id,
              })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
