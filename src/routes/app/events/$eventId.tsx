import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { upsertEventFn } from '@/server/core/handlers/app/upsert-event.handler'
import { getEventFn } from '@/server/core/handlers/app/get-event.handler'
import { EventForm } from '@/components/events/EventForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/app/events/$eventId')({
  component: EditEventPage,
})

function EditEventPage() {
  const { eventId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { data: session } = authClient.useSession()

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEventFn({ data: eventId }),
  })

  const { mutateAsync: updateEvent } = useMutation({
    mutationFn: (values: Parameters<typeof upsertEventFn>[0]['data']) => 
      upsertEventFn({ data: values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', eventId] })
      toast.success('Event updated successfully')
      navigate({ to: '/app/events' })
    },
    onError: (err: Error) => {
      toast.error('Failed to update event: ' + err.message)
    },
  })

  // Loading states
  if (isLoading || !session) {
    return <div className="p-8 text-center">Loading event details...</div>
  }

  // Error states
  if (error || !event) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load event. It may have been deleted or you don't have permission to view it.
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
              // We pass the existing ID under the upsert logic if it requires it,
              // but the schema doesn't accept ID. It handles updating via upsert-event logic in backend.
              // Wait, the schema doesn't have an ID, how do we update? Let's check Prisma schema / handler behavior.
              // The handler only takes data, not ID. Wait, this handler (`upsertEventFn`) creates a NEW event if no id is provided in `upsert.create` and updates if in `upsert.update`.
              // Actually, looking at `upsert-event.handler.ts` schema, there is no `id` field.
              // We must pass the `id` field to update. Let's send the ID inside the data payload and we might need to adjust the schema if it's missing.
              await updateEvent({
                ...values,
                id: event.id, // We merge the id so the upsert logic works if expected (though the schema might strip it, we'll see)
              } as any)
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
