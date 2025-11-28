import { Event, EventPhoto } from '../types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Event Service - localStorage implementation
 * Currently uses localStorage until backend is available
 * TODO: Replace with apiClient when backend is ready
 */

class EventService {
  private STORAGE_KEY = 'user_events'
  private PHOTOS_STORAGE_KEY = 'event_photos'
  private FACE_EMBEDDINGS_STORAGE_KEY = 'face_embeddings'

  /**
   * Create new event and store in localStorage
   */
  async createEvent(title: string, description: string): Promise<Event> {
    try {
      const userId = this.getCurrentUserId()
      const userInfo = this.getCurrentUserInfo()
      const eventId = uuidv4()
      
      const newEvent: Event = {
        id: eventId,
        title,
        description,
        organizerId: userId,
        createdBy: userInfo,
        status: 'draft',
        shareLink: `${window.location.origin}/share/${eventId}`,
        qrCode: this.generateQRCode(), // Placeholder for now
        participants: [userId],
        photoIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Get all events from localStorage
      const events = this.getAllEventsFromStorage()
      
      // Add new event
      events.push(newEvent)
      
      // Save back to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events))

      return newEvent
    } catch (error) {
      console.error('Error creating event:', error)
      throw new Error('Etkinlik oluştururken hata oluştu')
    }
  }

  /**
   * Get single event from localStorage
   */
  async getEvent(eventId: string): Promise<Event> {
    try {
      const events = this.getAllEventsFromStorage()
      const event = events.find((e) => e.id === eventId)

      if (!event) {
        throw new Error('Etkinlik bulunamadı')
      }

      return event
    } catch (error) {
      console.error('Error getting event:', error)
      throw error
    }
  }

  /**
   * Get all events for current user from localStorage
   */
  async getUserEvents(userId?: string): Promise<Event[]> {
    try {
      const currentUserId = userId || this.getCurrentUserId()
      const events = this.getAllEventsFromStorage()
      
      // Filter events where user is organizer OR participant
      return events.filter((e) => 
        e.organizerId === currentUserId || e.participants.includes(currentUserId)
      )
    } catch (error) {
      console.error('Error getting user events:', error)
      return []
    }
  }

  /**
   * Update event in localStorage
   */
  async updateEvent(
    eventId: string,
    data: Partial<Event>
  ): Promise<Event> {
    try {
      const events = this.getAllEventsFromStorage()
      const eventIndex = events.findIndex((e) => e.id === eventId)

      if (eventIndex === -1) {
        throw new Error('Etkinlik bulunamadı')
      }

      // Update event
      const updatedEvent = {
        ...events[eventIndex],
        ...data,
        id: events[eventIndex].id, // Don't allow id change
        organizerId: events[eventIndex].organizerId, // Don't allow organizerId change
        updatedAt: new Date().toISOString(),
      }

      events[eventIndex] = updatedEvent

      // Save back to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events))

      return updatedEvent
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  /**
   * Delete event from localStorage
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      const events = this.getAllEventsFromStorage()
      const filteredEvents = events.filter((e) => e.id !== eventId)

      // Also delete associated photos
      const photos = this.getAllPhotosFromStorage()
      const filteredPhotos = photos.filter((p) => p.eventId !== eventId)

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEvents))
      localStorage.setItem(this.PHOTOS_STORAGE_KEY, JSON.stringify(filteredPhotos))
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }

  /**
   * Upload photo to event (stored in localStorage)
   */
  async uploadPhoto(
    eventId: string,
    file: File
  ): Promise<EventPhoto> {
    try {
      const userId = this.getCurrentUserId()
      
      // Convert file to base64 for localStorage
      const base64 = await this.fileToBase64(file)

      const newPhoto: EventPhoto = {
        id: uuidv4(),
        eventId,
        userId,
        uploadedBy: 'User', // Get from user context
        url: base64, // Store as data URI
        fileName: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }

      // Get all photos
      const photos = this.getAllPhotosFromStorage()
      photos.push(newPhoto)

      // Save photos
      localStorage.setItem(this.PHOTOS_STORAGE_KEY, JSON.stringify(photos))

      // Update event's photoIds
      const event = await this.getEvent(eventId)
      await this.updateEvent(eventId, {
        photoIds: [...event.photoIds, newPhoto.id],
      })

      return newPhoto
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw new Error('Fotoğraf yüklenirken hata oluştu')
    }
  }

  /**
   * Get all photos for an event
   */
  async getEventPhotos(eventId: string): Promise<EventPhoto[]> {
    try {
      const photos = this.getAllPhotosFromStorage()
      return photos.filter((p) => p.eventId === eventId)
    } catch (error) {
      console.error('Error getting event photos:', error)
      return []
    }
  }

  /**
   * Get share link for event
   */
  async getShareLink(eventId: string): Promise<string> {
    const event = await this.getEvent(eventId)
    return event.shareLink
  }

  /**
   * Join event using share link
   */
  async joinEventByLink(shareLink: string): Promise<Event> {
    try {
      const events = this.getAllEventsFromStorage()
      const event = events.find((e) => e.shareLink === shareLink)

      if (!event) {
        // Try to extract event ID from share link and find it
        const eventId = this.extractEventIdFromShareLink(shareLink)
        if (eventId) {
          const eventFromId = events.find((e) => e.id === eventId)
          if (eventFromId) {
            const userId = this.getCurrentUserId()
            if (!eventFromId.participants.includes(userId)) {
              eventFromId.participants.push(userId)
              const eventIndex = events.findIndex((e) => e.id === eventFromId.id)
              events[eventIndex] = eventFromId
              localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events))
            }
            return eventFromId
          }
        }
        
        // If still not found, return a placeholder event (offline mode)
        console.warn('Event not found locally. Returning placeholder for offline mode.')
        return this.createPlaceholderEvent(shareLink)
      }

      const userId = this.getCurrentUserId()

      // Add user to participants if not already there
      if (!event.participants.includes(userId)) {
        event.participants.push(userId)
        const eventIndex = events.findIndex((e) => e.id === event.id)
        events[eventIndex] = event
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events))
      }

      return event
    } catch (error) {
      console.error('Error joining event:', error)
      // Return placeholder instead of throwing error
      return this.createPlaceholderEvent(shareLink)
    }
  }

  /**
   * Extract event ID from share link
   */
  private extractEventIdFromShareLink(shareLink: string): string | null {
    try {
      // Format: https://domain.com/share/{eventId}
      const match = shareLink.match(/\/share\/([a-f0-9\-]+)$/)
      return match ? match[1] : null
    } catch (error) {
      return null
    }
  }

  /**
   * Create placeholder event for offline/not-found scenarios
   */
  private createPlaceholderEvent(shareLink: string): Event {
    const eventId = this.extractEventIdFromShareLink(shareLink) || uuidv4()
    return {
      id: eventId,
      title: 'Etkinlik Yükleniyor...',
      description: 'Bu etkinlik şu anda yüklenmemiş. İnternet bağlantısı kontrol edin.',
      organizerId: 'unknown',
      createdBy: {
        id: 'unknown',
        name: 'Unknown',
        email: 'unknown@email.com',
      },
      status: 'draft',
      shareLink,
      qrCode: this.generateQRCode(),
      participants: [this.getCurrentUserId()],
      photoIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  /**
   * Add participant to event
   */
  async addEventParticipant(
    eventId: string,
    userId: string
  ): Promise<void> {
    try {
      const event = await this.getEvent(eventId)

      if (!event.participants.includes(userId)) {
        event.participants.push(userId)
        await this.updateEvent(eventId, { participants: event.participants })
      }
    } catch (error) {
      console.error('Error adding participant:', error)
      throw error
    }
  }

  // ==================== PRIVATE HELPER METHODS ====================

  /**
   * Get all events from localStorage
   */
  private getAllEventsFromStorage(): Event[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading events from storage:', error)
      return []
    }
  }

  /**
   * Get all photos from localStorage
   */
  private getAllPhotosFromStorage(): EventPhoto[] {
    try {
      const stored = localStorage.getItem(this.PHOTOS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading photos from storage:', error)
      return []
    }
  }

  /**
   * Get current user ID from localStorage
   */
  private getCurrentUserId(): string {
    try {
      const user = localStorage.getItem('user')
      if (user) {
        const parsed = JSON.parse(user)
        return parsed.id
      }
      // Fallback to a temporary ID if user not found
      return 'temp_user_' + Math.random().toString(36).substr(2, 9)
    } catch (error) {
      console.error('Error getting current user:', error)
      return 'unknown_user'
    }
  }

  /**
   * Get current user info from localStorage
   */
  private getCurrentUserInfo(): { id: string; name: string; email: string } {
    try {
      const user = localStorage.getItem('user')
      if (user) {
        const parsed = JSON.parse(user)
        return {
          id: parsed.id || 'unknown_user',
          name: parsed.displayName || parsed.name || 'Anonymous',
          email: parsed.email || 'unknown@email.com',
        }
      }
      const tempId = 'temp_user_' + Math.random().toString(36).substr(2, 9)
      return {
        id: tempId,
        name: 'Temporary User',
        email: 'temp@email.com',
      }
    } catch (error) {
      console.error('Error getting current user info:', error)
      return {
        id: 'unknown_user',
        name: 'Unknown User',
        email: 'unknown@email.com',
      }
    }
  }

  /**
   * Store face embeddings for a photo
   */
  async saveFaceEmbeddings(
    photoId: string,
    embeddings: number[][]
  ): Promise<void> {
    try {
      const faceData = this.getAllFaceEmbeddingsFromStorage()
      faceData[photoId] = embeddings
      localStorage.setItem(
        this.FACE_EMBEDDINGS_STORAGE_KEY,
        JSON.stringify(faceData)
      )
    } catch (error) {
      console.error('Error saving face embeddings:', error)
    }
  }

  /**
   * Get face embeddings for a photo
   */
  async getFaceEmbeddings(photoId: string): Promise<number[][] | null> {
    try {
      const faceData = this.getAllFaceEmbeddingsFromStorage()
      return faceData[photoId] || null
    } catch (error) {
      console.error('Error getting face embeddings:', error)
      return null
    }
  }

  /**
   * Get all face embeddings for event photos
   */
  async getEventFaceEmbeddings(
    eventId: string
  ): Promise<Array<{ photoId: string; embeddings: number[][] }>> {
    try {
      const photos = await this.getEventPhotos(eventId)
      const faceData = this.getAllFaceEmbeddingsFromStorage()

      const result: Array<{ photoId: string; embeddings: number[][] }> = []

      for (const photo of photos) {
        if (faceData[photo.id]) {
          result.push({
            photoId: photo.id,
            embeddings: faceData[photo.id],
          })
        }
      }

      return result
    } catch (error) {
      console.error('Error getting event face embeddings:', error)
      return []
    }
  }

  /**
   * Get all face embeddings from storage
   */
  private getAllFaceEmbeddingsFromStorage(): Record<string, number[][]> {
    try {
      const stored = localStorage.getItem(this.FACE_EMBEDDINGS_STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Error reading face embeddings from storage:', error)
      return {}
    }
  }

  /**
   * Convert file to base64 string
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Generate placeholder QR code
   * TODO: Replace with actual QR code generation library
   */
  private generateQRCode(): string {
    // Placeholder QR code - use `qrcode` npm package for real implementation
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  }
}

export const eventService = new EventService()
