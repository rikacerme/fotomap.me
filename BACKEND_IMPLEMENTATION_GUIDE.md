# 🚀 Backend Implementation Guide

## Quick Start

This guide provides everything needed to implement the Event Photos Platform backend.

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── firebase.ts
│   │   ├── env.ts
│   │   └── stripe.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   ├── rateLimit.ts
│   │   └── cors.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.router.ts
│   │   │   └── validators/
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.router.ts
│   │   ├── events/
│   │   │   ├── events.controller.ts
│   │   │   ├── events.service.ts
│   │   │   └── events.router.ts
│   │   ├── photos/
│   │   │   ├── photos.controller.ts
│   │   │   ├── photos.service.ts
│   │   │   └── photos.router.ts
│   │   ├── faces/
│   │   │   ├── faces.controller.ts
│   │   │   ├── faces.service.ts
│   │   │   └── faces.router.ts
│   │   └── subscriptions/
│   │       ├── subscriptions.controller.ts
│   │       ├── subscriptions.service.ts
│   │       └── subscriptions.router.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── validators.ts
│   ├── database/
│   │   └── migrations/
│   │       ├── 001_create_users.sql
│   │       ├── 002_create_events.sql
│   │       └── ...
│   └── app.ts
├── .env.example
├── package.json
├── tsconfig.json
├── docker-compose.yml
└── README.md
```

---

## Environment Variables

Create `.env` file based on `.env.example`:

```env
# Server
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000/api/v1
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/event_photos_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_photos_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=firebase@example.iam.gserviceaccount.com
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret

# AWS S3 (File Storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=event-photos-bucket

# Face Detection (Azure Face API or AWS Rekognition)
FACE_DETECTION_API_KEY=your_key
FACE_DETECTION_ENDPOINT=https://your-region.face.cognitive.microsoft.com/

# Email Service (SendGrid)
SENDGRID_API_KEY=your_api_key
SENDGRID_FROM_EMAIL=noreply@example.com

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRY=3600
REFRESH_TOKEN_EXPIRY=604800

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS_FREE=100
RATE_LIMIT_MAX_REQUESTS_PREMIUM=1000

# Logging
LOG_LEVEL=debug
LOG_FORMAT=json

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# File Upload
MAX_FILE_SIZE_MB=50
ACCEPTED_MIME_TYPES=image/jpeg,image/png,image/webp,image/heic

# Subscription Plans
FREE_PLAN_MAX_PHOTOS=50
FREE_PLAN_MAX_EVENTS=1
FREE_PLAN_STORAGE_GB=5
PREMIUM_PLAN_MONTHLY_PRICE=999
PREMIUM_PLAN_YEARLY_PRICE=9999
```

---

## Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "dotenv": "^16.3.1",
    "pg": "^8.11.1",
    "pg-promise": "^11.5.4",
    "firebase-admin": "^12.0.0",
    "jsonwebtoken": "^9.1.2",
    "bcryptjs": "^2.4.3",
    "stripe": "^14.7.0",
    "aws-sdk": "^2.1500.0",
    "multer": "^1.4.5-lts.1",
    "axios": "^1.6.2",
    "joi": "^17.11.0",
    "express-rate-limit": "^7.1.5",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "winston": "^3.11.0",
    "uuid": "^9.0.1",
    "moment": "^2.29.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "@types/jest": "^29.5.11",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "supertest": "^6.3.3"
  }
}
```

### Installation

```bash
npm init -y
npm install express express-async-errors dotenv pg pg-promise firebase-admin jsonwebtoken bcryptjs stripe aws-sdk multer axios joi express-rate-limit cors helmet winston uuid moment
npm install -D typescript @types/express @types/node ts-node nodemon jest ts-jest @types/jest supertest
```

---

## Implementation Steps

### Phase 1: Setup & Configuration (Week 1)

- [ ] Initialize Node.js/Express project
- [ ] Setup TypeScript configuration
- [ ] Configure environment variables
- [ ] Setup logging (Winston)
- [ ] Configure database connection
- [ ] Run database migrations
- [ ] Setup middleware (CORS, Helmet, Error Handler)
- [ ] Configure Firebase Admin SDK

**Files to Create**:
- `src/config/database.ts` - Database connection
- `src/config/firebase.ts` - Firebase setup
- `src/config/env.ts` - Environment validation
- `src/middleware/errorHandler.ts` - Global error handling
- `src/utils/logger.ts` - Logging utility
- `src/app.ts` - Express app setup

**Commands**:
```bash
npm run db:migrate
npm run dev
```

---

### Phase 2: Authentication (Week 1-2)

- [ ] Setup JWT authentication
- [ ] Implement email/password auth
- [ ] Implement Google OAuth verification
- [ ] Implement Apple OAuth verification
- [ ] Create user registration endpoint
- [ ] Create login endpoints (email, Google, Apple)
- [ ] Create logout endpoint
- [ ] Create token refresh endpoint
- [ ] Add auth middleware
- [ ] Write auth tests

**Files to Create**:
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/auth.router.ts`
- `src/modules/auth/validators/`

**Tests**:
```bash
npm run test:auth
```

**Endpoints to Test**:
```
POST /api/v1/auth/signup
POST /api/v1/auth/login/email
POST /api/v1/auth/login/google
POST /api/v1/auth/login/apple
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
```

---

### Phase 3: User Management (Week 2)

- [ ] Create user profile endpoint
- [ ] Implement profile update
- [ ] Get subscription details
- [ ] List user events
- [ ] Get user statistics
- [ ] Soft delete user

**Files to Create**:
- `src/modules/users/users.controller.ts`
- `src/modules/users/users.service.ts`
- `src/modules/users/users.router.ts`

**Endpoints**:
```
GET /api/v1/auth/me
PUT /api/v1/users/{userId}
GET /api/v1/users/{userId}/subscription
GET /api/v1/users/{userId}
DELETE /api/v1/users/{userId}
```

---

### Phase 4: Events Management (Week 2-3)

- [ ] Create event
- [ ] Get event details
- [ ] List user events (with filters)
- [ ] Update event
- [ ] Delete event (cascade delete photos)
- [ ] Generate share link & QR code
- [ ] Get event statistics
- [ ] Search events
- [ ] Implement soft delete

**Dependencies**:
```bash
npm install qrcode
```

**Files to Create**:
- `src/modules/events/events.controller.ts`
- `src/modules/events/events.service.ts`
- `src/modules/events/events.router.ts`

**Key Logic**:
- Free users max 1 event
- Premium users unlimited
- Generate unique share token
- Generate QR code for sharing

**Endpoints**:
```
POST /api/v1/events
GET /api/v1/events/{eventId}
GET /api/v1/events
PUT /api/v1/events/{eventId}
DELETE /api/v1/events/{eventId}
GET /api/v1/events/search
GET /api/v1/events/{eventId}/stats
```

---

### Phase 5: Participants Management (Week 3)

- [ ] Add participant to event
- [ ] List event participants
- [ ] Remove participant
- [ ] Join event by share link
- [ ] Update participant permissions

**Files to Create**:
- Update `src/modules/events/events.service.ts`
- Create `src/modules/events/participants.service.ts`

**Endpoints**:
```
POST /api/v1/events/{eventId}/participants
GET /api/v1/events/{eventId}/participants
DELETE /api/v1/events/{eventId}/participants/{userId}
POST /api/v1/events/join
```

---

### Phase 6: Photos Management (Week 3-4)

- [ ] Upload photo to event
- [ ] Get event photos (with pagination)
- [ ] Get photo details with metadata
- [ ] Delete photo
- [ ] Update storage usage
- [ ] Handle different image formats
- [ ] Generate thumbnails
- [ ] Compress images

**Dependencies**:
```bash
npm install sharp
```

**Files to Create**:
- `src/modules/photos/photos.controller.ts`
- `src/modules/photos/photos.service.ts`
- `src/modules/photos/photos.router.ts`
- `src/modules/photos/storage.service.ts`

**Key Features**:
- Image validation & compression
- S3 upload with signed URLs
- Thumbnail generation
- EXIF data extraction
- Storage quota checks

**Endpoints**:
```
POST /api/v1/events/{eventId}/photos
GET /api/v1/events/{eventId}/photos
GET /api/v1/events/{eventId}/photos/{photoId}
DELETE /api/v1/events/{eventId}/photos/{photoId}
GET /api/v1/public/events/{shareToken}/photos
```

---

### Phase 7: Face Detection (Week 4-5)

- [ ] Integrate Azure Face API or AWS Rekognition
- [ ] Detect faces in uploaded photo
- [ ] Store face embeddings
- [ ] Find face across event photos
- [ ] Match faces with participants
- [ ] Get participant photos
- [ ] Update detection status

**Files to Create**:
- `src/modules/faces/faces.controller.ts`
- `src/modules/faces/faces.service.ts`
- `src/modules/faces/faces.router.ts`

**Integration Options**:
1. **Azure Face API** - Recommended
   ```bash
   npm install @azure/cognitiveservices-face
   ```

2. **AWS Rekognition**
   ```bash
   # Already in aws-sdk
   ```

**Endpoints**:
```
POST /api/v1/photos/{photoId}/detect-faces
POST /api/v1/events/{eventId}/find-faces
GET /api/v1/events/{eventId}/participant-photos/{userId}
```

---

### Phase 8: Subscriptions & Payments (Week 5-6)

- [ ] Setup Stripe integration
- [ ] Create subscription plans
- [ ] Implement upgrade endpoint
- [ ] Handle webhook events
- [ ] Update user subscription
- [ ] Enforce plan limits
- [ ] Invoice generation
- [ ] Refund handling

**Files to Create**:
- `src/modules/subscriptions/subscriptions.controller.ts`
- `src/modules/subscriptions/subscriptions.service.ts`
- `src/modules/subscriptions/subscriptions.router.ts`
- `src/modules/subscriptions/stripe.webhook.ts`

**Stripe Setup**:
```bash
npm install stripe
```

**Endpoints**:
```
GET /api/v1/users/{userId}/subscription
POST /api/v1/users/{userId}/upgrade
POST /api/v1/webhooks/stripe (webhook)
GET /api/v1/subscriptions/plans
```

---

### Phase 9: Testing & Optimization (Week 6)

- [ ] Unit tests for all services
- [ ] Integration tests for all routes
- [ ] Load testing
- [ ] Database query optimization
- [ ] Add caching (Redis)
- [ ] API documentation (Swagger)
- [ ] Performance monitoring

**Commands**:
```bash
npm run test
npm run test:coverage
npm run test:load
npm run build
```

---

### Phase 10: Deployment (Week 6-7)

- [ ] Docker setup
- [ ] Environment configuration
- [ ] Database migrations on production
- [ ] Setup monitoring & logging
- [ ] Setup backup strategy
- [ ] Security audit
- [ ] Load balancing setup
- [ ] CDN for image delivery

**Deployment Options**:
- AWS EC2 + RDS
- Heroku
- DigitalOcean
- Railway
- Render

---

## Key Implementation Details

### 1. File Upload Pipeline

```typescript
// Request Flow:
1. Client uploads file (multipart/form-data)
2. Multer validates file type & size
3. Sharp compresses & creates thumbnails
4. Upload to S3
5. Extract EXIF data
6. Save metadata to database
7. Trigger face detection (async)
8. Return response with URLs

// Validations:
- Max size: 50MB (free), 500MB (premium)
- Allowed types: JPEG, PNG, WebP, HEIC
- Check storage quota before upload
```

### 2. Face Detection Pipeline

```typescript
// Request Flow:
1. Photo uploaded
2. Mark as face_detection_status = 'pending'
3. Queue async face detection job
4. Call Azure Face API / AWS Rekognition
5. Extract face embeddings
6. Store in face_detections table
7. Match with other event faces
8. Update face_detection_status = 'completed'
9. Notify frontend via webhook/polling
```

### 3. Share Link Generation

```typescript
// Share Link Format:
https://app.example.com/events/{share_token}

// Share Token:
- Unique UUID
- Not exposed in database queries
- Can be regenerated
- Can be revoked

// Public Access:
- No authentication required
- Limited data exposure
- No upload allowed
- Rate limited
```

### 4. Storage Quota Management

```typescript
// Free Plan (5GB):
- Check before each upload
- Reject if quota exceeded
- Show remaining storage

// Premium Plan (1TB):
- Automatic upgrade limits
- Soft limit warning at 90%
- Hard limit at 100%

// Cleanup:
- Archive old photos
- Soft delete photos (keep 30 days)
- Hard delete after 30 days
```

### 5. Rate Limiting Strategy

```typescript
// Free Plan: 100 requests/hour
- Face detection: 10/hour
- File upload: 100MB/hour

// Premium Plan: 1000 requests/hour
- Face detection: Unlimited
- File upload: 1GB/hour

// Implementation:
- Use redis-based rate limiting
- Per user, per endpoint
- Return X-RateLimit headers
```

### 6. Error Handling

```typescript
// Standard Error Response:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Doğrulama hatası",
    "details": [
      { "field": "email", "message": "Geçerli email girin" }
    ],
    "timestamp": "2025-11-28T14:30:00Z",
    "requestId": "req_12345"
  }
}

// Log all errors:
- Error code & message
- Stack trace (dev only)
- Request ID for tracing
- User ID (if authenticated)
```

---

## Testing Strategy

### Unit Tests
```bash
npm run test:unit

# Test each service independently
- authService.test.ts
- eventsService.test.ts
- photosService.test.ts
- facesService.test.ts
```

### Integration Tests
```bash
npm run test:integration

# Test API endpoints with database
- auth.routes.test.ts
- events.routes.test.ts
- photos.routes.test.ts
```

### End-to-End Tests
```bash
npm run test:e2e

# Complete user journeys
- User registration → Create event → Upload photo → Share
```

---

## Database Migrations

```bash
# Create new migration
npm run db:migration:create add_new_column

# Run pending migrations
npm run db:migrate

# Rollback last migration
npm run db:rollback

# Check migration status
npm run db:status
```

---

## Performance Optimization

1. **Database Indexing**
   - Index on user_id, event_id, created_at
   - Composite indexes for common queries
   - Partial indexes for soft deletes

2. **Caching Strategy**
   - Redis for session storage
   - Cache user profiles (1 hour)
   - Cache event listings (15 mins)
   - Cache public event data (1 hour)

3. **API Optimization**
   - Pagination for all list endpoints
   - Select only needed columns
   - Use database views for complex queries
   - Lazy load relations

4. **Image Optimization**
   - Compress on upload
   - Generate multiple sizes
   - Use CDN for delivery
   - Lazy load in frontend

---

## Monitoring & Logging

```bash
# Application Logs
- Error logging: All errors with stack traces
- Access logging: All API requests
- Performance logging: Query times > 1s

# Monitoring Metrics
- API response time (p50, p95, p99)
- Error rate by endpoint
- Database query performance
- Storage usage by user
- Face detection usage

# Tools
- New Relic / DataDog
- Sentry for error tracking
- ELK stack for logs
```

---

## Security Checklist

- [ ] HTTPS only in production
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS protection headers
- [ ] CSRF protection
- [ ] Secure password hashing (bcrypt)
- [ ] JWT validation on all endpoints
- [ ] File upload validation (type, size, scan)
- [ ] API keys in environment variables
- [ ] Database credentials encrypted
- [ ] Sensitive data not logged
- [ ] Regular security audits
- [ ] Dependency updates

---

## Deployment Checklist

### Before Deployment
- [ ] All tests passing
- [ ] No console.log statements
- [ ] Environment variables set
- [ ] Database backups configured
- [ ] Monitoring setup
- [ ] Error tracking configured
- [ ] SSL certificate installed
- [ ] CORS origins updated

### Post Deployment
- [ ] Health check endpoint working
- [ ] All APIs responding
- [ ] Database connections stable
- [ ] Logs flowing to monitoring
- [ ] Backups running
- [ ] Performance acceptable

---

## Quick Reference

### Common Commands
```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build TypeScript
npm start            # Start production server

# Testing
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed test data
npm run db:reset     # Drop & recreate

# Deployment
npm run build && npm start
```

### API Base URL
```
Development: http://localhost:3000/api/v1
Production: https://api.example.com/api/v1
```

### Authentication Header
```
Authorization: Bearer {accessToken}
```

---

**Last Updated**: November 28, 2025
**Ready to Start**: Yes! ✅
**Est. Development Time**: 6-8 weeks with team of 2-3
**Recommended Tech Stack**: Node.js + Express + PostgreSQL + Firebase Auth
