import { useState, useCallback } from 'react'
import { eventService } from '../services/eventService'
import { Event } from '../types'

export function useCreateEvent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEvent = useCallback(
    async (title: string, description: string): Promise<Event | null> => {
      setIsLoading(true)
      setError(null)
      try {
        const event = await eventService.createEvent(title, description)
        return event
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create event'
        setError(errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return { createEvent, isLoading, error }
}

export function useEventPhotos(eventId: string) {
  const [photos, setPhotos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPhotos = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const eventPhotos = await eventService.getEventPhotos(eventId)
      setPhotos(eventPhotos)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load photos'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  const uploadPhoto = useCallback(
    async (file: File) => {
      try {
        const photo = await eventService.uploadPhoto(eventId, file)
        setPhotos((prev) => [...prev, photo])
        return photo
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload photo'
        setError(errorMessage)
        throw err
      }
    },
    [eventId]
  )

  return { photos, isLoading, error, loadPhotos, uploadPhoto }
}

export function useGetEvent(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEvent = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const loadedEvent = await eventService.getEvent(eventId)
      setEvent(loadedEvent)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load event'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  return { event, isLoading, error, loadEvent }
}
