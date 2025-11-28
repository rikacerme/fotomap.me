// Feature-specific stories and status

// Auth Feature - What happens during authentication
export const AUTH_FEATURE_STORY = `
1. User visits the app → LoginPage
2. User clicks "Login with Google"
3. Google OAuth flow → User authenticates
4. Backend returns user data + tokens
5. Tokens stored in localStorage
6. authStore updated with user data
7. User redirected to HomePage
`

// Events Feature - Complete event lifecycle
export const EVENTS_FEATURE_STORY = `
1. User clicks "Create Event"
2. Form validation (title required)
3. Event created on backend
4. QR code and share link generated
5. User shares link/QR with participants
6. Participants scan QR or click link
7. They upload their face photos
8. Admin scans event for matches
9. Participants see photos of themselves
`

// Payment Feature - Subscription flow
export const PAYMENT_FEATURE_STORY = `
1. User views pricing page
2. User selects Premium package
3. Payment initialized on backend
4. User completes payment
5. Subscription updated to premium
6. User gains unlimited features
7. Can create unlimited events
8. Can upload 500 photos
`

// Face Detection Feature - Scan workflow
export const FACE_DETECTION_STORY = `
1. Event has all participant photos uploaded
2. User clicks "Scan for My Face"
3. Face encoding generated from user's face photo
4. Model scans all event photos
5. Finds matches above confidence threshold
6. Returns matched photos with bounding boxes
7. User views personal photo gallery
8. Can download or share matched photos
`

// Current status and next steps
export const PROJECT_STATUS = {
  completed: [
    'Project structure and folder organization',
    'TypeScript strict mode configuration',
    'Type definitions for all features',
    'Authentication service and hooks',
    'Event management service and hooks',
    'Payment service and hooks',
    'Face detection service and hooks',
    'Global state management with Zustand',
    'Shared components (Header, Layout, Upload)',
    'Page components (Home, Pricing, Create Event, Detail)',
    'Routing with React Router',
    'API client with interceptors',
    'Storage client abstraction',
    'Configuration management',
  ],
  inProgress: [
    'UI component refinements',
    'Face detection integration',
    'Payment processing integration',
    'Testing implementation',
  ],
  todo: [
    'Backend API implementation',
    'Database schema and migrations',
    'Google OAuth setup',
    'Stripe payment integration',
    'Face-api.js model loading and inference',
    'Real file upload to cloud storage',
    'Email notifications',
    'Advanced search and filters',
    'Photo editing tools',
    'Social sharing features',
    'Analytics dashboard',
    'Admin panel',
    'Mobile responsiveness optimization',
    'Performance optimization',
    'Security hardening',
    'E2E tests',
    'Unit tests',
    'Integration tests',
  ],
}
