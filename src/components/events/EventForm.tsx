import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { upsertEventSchema } from '@/server/core/handlers/app/upsert-event.handler'
import { z } from 'zod'
import { EventStatus } from 'generated/enums'

type EventFormValues = z.infer<typeof upsertEventSchema>

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>
  onSubmit: (values: EventFormValues) => Promise<void>
  userId: string
}

export function EventForm({ defaultValues, onSubmit, userId }: EventFormProps) {
  const form = useForm({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      content: defaultValues?.content ?? '',
      location: defaultValues?.location ?? '',
      startTime: defaultValues?.startTime ?? new Date(),
      endTime: defaultValues?.endTime ?? new Date(Date.now() + 3600000), // Default to 1 hour from now
      capacity: defaultValues?.capacity ?? null,
      status: defaultValues?.status ?? EventStatus.DRAFT,
      isPublic: defaultValues?.isPublic ?? false,
      createdById: userId,
    } as EventFormValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
    // @ts-expect-error - Expected due to mismatch in React Form and Zod versions
    validatorAdapter: zodValidator(),
    validators: {
      onChange: upsertEventSchema as any,
    },
  })

  // We use the custom DateTimePicker instead


  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <form.Field
        name="title"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Event Title *</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="WMU Hackathon 2026"
            />
            {field.state.meta.errors ? (
              <em className="text-sm text-destructive" role="alert">
                {field.state.meta.errors.join(', ')}
              </em>
            ) : null}
          </div>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field
          name="startTime"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Start Time *</Label>
              <DateTimePicker
                value={field.state.value}
                onChange={(newDate) => {
                  field.handleChange(newDate)
                  // Auto-bump the end time if start time crosses it
                  const currentEnd = form.getFieldValue('endTime')
                  if (newDate >= currentEnd) {
                    form.setFieldValue('endTime', new Date(newDate.getTime() + 3600000)) // +1 hour
                  }
                }}
              />
              {field.state.meta.errors ? (
                <em className="text-sm text-destructive" role="alert">
                  {field.state.meta.errors.join(', ')}
                </em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="endTime"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>End Time *</Label>
              <DateTimePicker
                value={field.state.value}
                onChange={(newDate) => field.handleChange(newDate)}
              />
              {field.state.meta.errors ? (
                <em className="text-sm text-destructive" role="alert">
                  {field.state.meta.errors.join(', ')}
                </em>
              ) : null}
            </div>
          )}
        />
      </div>

      <form.Field
        name="location"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Location</Label>
            <Input
              id={field.name}
              value={field.state.value ?? ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Parkview Campus Room D-115"
            />
          </div>
        )}
      />

      <form.Field
        name="description"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Description</Label>
            <Textarea
              id={field.name}
              value={field.state.value ?? ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Join us for..."
              className="resize-y"
              rows={3}
            />
          </div>
        )}
      />

      <form.Field
        name="content"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Markdown Content</Label>
            <Textarea
              id={field.name}
              value={field.state.value ?? ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="## Hackathon Details\n\nWrite the full event text here utilizing Markdown formatting."
              className="resize-y font-mono"
              rows={10}
            />
          </div>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form.Field
          name="status"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Status</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as EventStatus)}
              >
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EventStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={EventStatus.REVIEW}>Review</SelectItem>
                  <SelectItem value={EventStatus.APPROVED}>Approved</SelectItem>
                  <SelectItem value={EventStatus.PUBLISHED}>Published</SelectItem>
                  <SelectItem value={EventStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={EventStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />

        <form.Field
          name="capacity"
          children={(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Capacity (Optional)</Label>
              <Input
                id={field.name}
                type="number"
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value ? parseInt(e.target.value, 10) : null,
                  )
                }
                placeholder="50"
              />
            </div>
          )}
        />
      </div>

      <form.Field
        name="isPublic"
        children={(field) => (
          <div className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
            <Checkbox
              id={field.name}
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked as boolean)}
              onBlur={field.handleBlur}
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor={field.name}>Public Event</Label>
              <p className="text-sm text-muted-foreground">
                Display this event on the public landing page.
              </p>
            </div>
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.errorMap]}
        children={([errorMap]) => {
          if (!errorMap || !errorMap.onChange) return null
          return (
            <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
              {errorMap.onChange.toString()}
            </div>
          )
        }}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Event'}
            </Button>
          </div>
        )}
      />
    </form>
  )
}
