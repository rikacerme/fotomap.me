/**
 * Backend API Types & Interfaces
 * Use these types for request/response validation and TypeScript support
 */

// ==================== AUTH TYPES ====================

export interface SignupRequest {
  email: string
  password: string
  name: string
}

export interface LoginEmailRequest {
  email: string
  password: string
}

export interface GoogleLoginRequest {
  idToken: string
  googleId: string
}

export interface AppleLoginRequest {
  identityToken: string
  user: {
    name: {
      firstName: string
      lastName: string
    }
    email: string
  }
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface LogoutResponse {
  message: string
  success: boolean
}

// ==================== USER TYPES ====================

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  subscription: 'free' | 'premium'
  photoCount: number
  maxPhotos: number
  createdAt: string
  updatedAt: string
}

export interface UpdateUserRequest {
  name?: string
  avatar?: string
}

export interface SubscriptionInfo {
  userId: string
  subscription: 'free' | 'premium'
  photoCount: number
  maxPhotos: number
  eventCount: number
  maxEvents: number
  storageUsed: number
  storageLimit: number
  subscriptionStartDate: string
  subscriptionEndDate?: string
  autoRenew: boolean
}

export interface UpgradeRequest {
  paymentMethodId: string
  plan: 'premium_monthly' | 'premium_yearly'
}

// ==================== EVENT TYPES ====================

export interface CreateEventRequest {
  title: string
  description: string
  status?: 'draft' | 'active' | 'completed'
}

export interface UpdateEventRequest {
  title?: string
  description?: string
  status?: 'draft' | 'active' | 'completed'
}

export interface Event {
  id: string
  title: string
  description: string
  organizerId: string
  status: 'draft' | 'active' | 'completed'
  shareLink: string
  qrCode: string
  participants: string[] | Participant[]
  photoIds: string[]
  createdAt: string
  updatedAt: string
}

export interface EventWithPhotosCount extends Event {
  photosCount: number
}

export interface Participant {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'organizer' | 'participant'
  joinedAt: string
}

export interface EventListResponse {
  data: Event[]
  pagination: PaginationInfo
}

export interface PaginationInfo {
  total: number
  limit: number
  offset: number
  pages: number
}

export interface EventStatistics {
  eventId: string
  title: string
  totalPhotos: number
  totalParticipants: number
  totalFacesDetected: number
  uploadsByDay: DailyUploadStats[]
  topContributors: TopContributor[]
  storageUsed: number
  lastActivity: string
}

export interface DailyUploadStats {
  date: string
  count: number
}

export interface TopContributor {
  userId: string
  name: string
  photoCount: number
}

// ==================== PHOTO TYPES ====================

export interface UploadPhotoResponse {
  id: string
  eventId: string
  userId: string
  uploadedBy: string
  url: string
  fileName: string
  size: number
  mimeType: string
  uploadedAt: string
}

export interface EventPhoto {
  id: string
  eventId: string
  userId: string
  uploadedBy: string
  url: string
  thumbnailUrl?: string
  fileName: string
  size: number
  mimeType: string
  uploadedAt: string
}

export interface PhotoDetailsResponse extends EventPhoto {
  metadata?: PhotoMetadata
}

export interface PhotoMetadata {
  width: number
  height: number
  orientation: number
  camera?: string
  dateTaken?: string
}

export interface PhotoListResponse {
  data: EventPhoto[]
  pagination: PaginationInfo
}

// ==================== PARTICIPANT TYPES ====================

export interface AddParticipantRequest {
  userId: string
}

export interface AddParticipantResponse {
  eventId: string
  userId: string
  joinedAt: string
  role: string
}

export interface ParticipantListResponse {
  data: Participant[]
  pagination: PaginationInfo
}

export interface JoinEventRequest {
  shareLink: string
}

// ==================== FACE DETECTION TYPES ====================

export interface DetectFacesRequest {
  model?: 'default' | 'accurate'
}

export interface FaceDetectionResponse {
  photoId: string
  facesDetected: number
  faces: DetectedFace[]
}

export interface DetectedFace {
  faceId: string
  confidence: number
  boundingBox: BoundingBox
  landmarks: FaceLandmarks
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface FaceLandmarks {
  leftEye: Point
  rightEye: Point
  nose: Point
  mouth: Point
}

export interface Point {
  x: number
  y: number
}

export interface FindFacesRequest {
  faceId: string
  threshold?: number
}

export interface FaceMatchResponse {
  faceId: string
  matches: FaceMatch[]
  totalMatches: number
}

export interface FaceMatch {
  photoId: string
  fileName: string
  url: string
  confidence: number
  boundingBox: BoundingBox
  uploadedBy: string
  uploadedAt: string
}

export interface ParticipantPhotosRequest {
  minConfidence?: number
}

export interface ParticipantPhotosResponse {
  eventId: string
  userId: string
  userName: string
  data: EventPhoto[]
  pagination: PaginationInfo
}

// ==================== SEARCH & FILTER TYPES ====================

export interface SearchEventsRequest {
  q: string
  status?: 'draft' | 'active' | 'completed'
  limit?: number
  offset?: number
}

export interface SearchEventsResponse {
  data: Event[]
  pagination: PaginationInfo
}

// ==================== PUBLIC ENDPOINT TYPES ====================

export interface PublicEventResponse {
  id: string
  title: string
  description: string
  organizerName: string
  status: 'draft' | 'active' | 'completed'
  participantsCount: number
  photosCount: number
  createdAt: string
}

export interface PublicPhotoListResponse {
  data: PublicPhoto[]
  pagination: PaginationInfo
}

export interface PublicPhoto {
  id: string
  fileName: string
  url: string
  thumbnailUrl?: string
  uploadedBy: string
  uploadedAt: string
}

// ==================== ERROR TYPES ====================

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_REQUIRED'
  | 'INVALID_TOKEN'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'PAYMENT_REQUIRED'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'

export interface ErrorDetail {
  field?: string
  message: string
}

export interface ApiError {
  error: {
    code: ErrorCode
    message: string
    details?: ErrorDetail[]
    timestamp: string
    requestId: string
  }
}

export interface ValidationError extends ApiError {
  error: {
    code: 'VALIDATION_ERROR'
    message: string
    details: ErrorDetail[]
    timestamp: string
    requestId: string
  }
}

// ==================== WEBHOOK TYPES ====================

export interface WebhookRegistration {
  url: string
  events: WebhookEvent[]
  secret: string
}

export type WebhookEvent =
  | 'event.created'
  | 'event.updated'
  | 'event.deleted'
  | 'photo.uploaded'
  | 'participant.added'
  | 'participant.removed'
  | 'faces.detected'

export interface WebhookPayload<T = any> {
  event: WebhookEvent
  timestamp: string
  data: T
  signature: string
}

// ==================== QUERY PARAMETERS ====================

export interface ListQueryParams {
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface EventListQueryParams extends ListQueryParams {
  status?: 'draft' | 'active' | 'completed'
}

export interface PhotoListQueryParams extends ListQueryParams {
  tags?: string[]
}

export interface ParticipantPhotosQueryParams extends ListQueryParams {
  minConfidence?: number
}

// ==================== API RESPONSE WRAPPER ====================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: {
    timestamp: string
    requestId: string
  }
}

export interface PaginatedApiResponse<T = any> {
  success: boolean
  data: T[]
  pagination: PaginationInfo
  meta?: {
    timestamp: string
    requestId: string
  }
}

// ==================== CONSTANTS ====================

export const FREE_PLAN_LIMITS = {
  maxPhotos: 50,
  maxEvents: 1,
  maxParticipants: 10,
  maxStorageBytes: 5 * 1024 * 1024 * 1024, // 5GB
  faceDetectionsPerHour: 10,
  requestsPerHour: 100,
  maxFileSize: 50 * 1024 * 1024, // 50MB
}

export const PREMIUM_PLAN_LIMITS = {
  maxPhotos: 999999,
  maxEvents: 999999,
  maxParticipants: 999999,
  maxStorageBytes: 1024 * 1024 * 1024 * 1024, // 1TB
  faceDetectionsPerHour: 999999,
  requestsPerHour: 1000,
  maxFileSize: 500 * 1024 * 1024, // 500MB
}

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMIT_EXCEEDED: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}

export const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]

export const EVENT_STATUSES = ['draft', 'active', 'completed'] as const
export type EventStatus = typeof EVENT_STATUSES[number]

export const SUBSCRIPTION_TYPES = ['free', 'premium'] as const
export type SubscriptionType = typeof SUBSCRIPTION_TYPES[number]
