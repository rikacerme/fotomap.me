// Development mode API adapter
// When VITE_API_URL is not set, this mock adapter simulates API responses

import { mockAuthResponse, mockEvent, mockFaceDetectionResult } from './apiResponses'

interface MockResponse<T> {
  data: T
  status: number
}

class MockApiAdapter {
  private delay = 500 // Simulate network delay

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async get<T>(url: string): Promise<MockResponse<T>> {
    await this.sleep(this.delay)

    if (url.includes('/auth/me')) {
      return { data: mockAuthResponse.user as T, status: 200 }
    }

    if (url.includes('/events') && !url.includes('/photos')) {
      return {
        data: [
          mockEvent,
          { ...mockEvent, id: 'event_456', title: 'Beach Party' },
        ] as T,
        status: 200,
      }
    }

    if (url.includes('/events') && url.includes('/photos')) {
      return {
        data: [
          {
            id: 'photo_1',
            eventId: mockEvent.id,
            url: 'https://via.placeholder.com/400',
            fileName: 'photo1.jpg',
            uploadedAt: new Date().toISOString(),
          },
        ] as T,
        status: 200,
      }
    }

    throw new Error(`Mock GET ${url} not implemented`)
  }

  async post<T>(url: string, data?: any): Promise<MockResponse<T>> {
    await this.sleep(this.delay)

    if (url.includes('/auth/google')) {
      return { data: mockAuthResponse as T, status: 200 }
    }

    if (url.includes('/auth/signup')) {
      return {
        data: {
          ...mockAuthResponse,
          user: { ...mockAuthResponse.user, email: data.email, name: data.name },
        } as T,
        status: 200,
      }
    }

    if (url.includes('/events') && !data?.file) {
      return {
        data: {
          ...mockEvent,
          id: `event_${Date.now()}`,
          title: data.title,
          description: data.description,
        } as T,
        status: 201,
      }
    }

    if (url.includes('/payments/initialize')) {
      return {
        data: {
          id: `pi_${Date.now()}`,
          amount: 999,
          currency: 'USD',
          clientSecret: `secret_${Date.now()}`,
        } as T,
        status: 200,
      }
    }

    if (url.includes('/face-detection/scan-event')) {
      return {
        data: mockFaceDetectionResult as T,
        status: 200,
      }
    }

    throw new Error(`Mock POST ${url} not implemented`)
  }

  async put<T>(url: string, data?: any): Promise<MockResponse<T>> {
    await this.sleep(this.delay)
    throw new Error(`Mock PUT ${url} not implemented`)
  }

  async delete(url: string): Promise<{ status: number }> {
    await this.sleep(this.delay)
    throw new Error(`Mock DELETE ${url} not implemented`)
  }
}

export const mockApiAdapter = new MockApiAdapter()
