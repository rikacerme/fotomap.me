# 📚 Event Photos Platform - Complete Backend Documentation

## 📋 What's Inside

Complete backend documentation for **Event Photos Platform** - a full-stack photo sharing application with face detection, event management, and subscription system.

---

## 📄 Documentation Files

### 1. **API_DOCUMENTATION.md** 
Complete REST API specification with all 30 endpoints

**Includes**:
- 🔐 Authentication (signup, login, logout)
- 👤 User management (profile, subscription)
- 📅 Events CRUD operations
- 📸 Photo upload & management
- 👥 Participant management
- 🎭 Face detection & matching
- 🔍 Search & filtering
- 📊 Statistics & analytics
- ⚠️ Error handling & status codes
- 📈 Rate limiting info
- 📦 Data types & schemas

**Key Sections**:
- Base URL and authentication method
- 30 detailed endpoint specifications
- Request/response examples for every endpoint
- Error codes and validation rules
- Rate limiting per subscription tier
- Webhook documentation

---

### 2. **API_TYPES.ts**
TypeScript type definitions for all API requests/responses

**Includes**:
- ✅ Type-safe request/response interfaces
- 🔐 Authentication types (signup, login, tokens)
- 👤 User types (profile, subscription)
- 📅 Event types with relationships
- 📸 Photo and metadata types
- 🎭 Face detection types (embeddings, landmarks)
- ⚙️ Query parameter interfaces
- 🔧 Constants for plan limits and file types
- ❌ Error type definitions
- 🪝 Webhook types

**Can be used**:
- In backend TypeScript code
- Copied to frontend for type consistency
- For API client generation
- In test suites

---

### 3. **DATABASE_SCHEMA.md**
Complete PostgreSQL database schema

**Includes**:
- 🗄️ 8 main tables with full schema definitions
- 🔑 Primary and foreign keys
- 📊 All column definitions with types
- ✅ Constraints and validations
- 🔍 Index strategy for performance
- 📈 Views for common queries
- 🔧 Migration scripts
- 📋 Triggers for automatic timestamps
- 📝 Stored procedures for calculations
- 🔄 Backup & recovery instructions

**Tables**:
1. **users** - User accounts & subscriptions
2. **events** - Event creation & metadata
3. **event_participants** - User participation in events
4. **photos** - Uploaded images
5. **face_detections** - Detected faces with embeddings
6. **face_matches** - Face similarity matches
7. **subscriptions** - Payment & plan information
8. **audit_logs** - System activity tracking

---

### 4. **BACKEND_IMPLEMENTATION_GUIDE.md**
Step-by-step guide to implement the entire backend

**Includes**:
- 📂 Recommended project structure
- 🔧 Environment variables (.env template)
- 📦 All required npm dependencies
- 📋 10-phase implementation plan
- ⏱️ Time estimates per phase
- ✅ Implementation checklist
- 🧪 Testing strategy
- 🚀 Deployment instructions
- 🔒 Security checklist
- 📊 Performance optimization
- 🪵 Logging & monitoring setup

**Implementation Phases**:
1. Setup & Configuration (Week 1)
2. Authentication (Week 1-2)
3. User Management (Week 2)
4. Events Management (Week 2-3)
5. Participants Management (Week 3)
6. Photos Management (Week 3-4)
7. Face Detection (Week 4-5)
8. Subscriptions & Payments (Week 5-6)
9. Testing & Optimization (Week 6)
10. Deployment (Week 6-7)

---

### 5. **Postman_Collection.json**
Ready-to-use Postman API collection for testing

**Includes**:
- 📝 30 API endpoints fully configured
- 🔐 Authentication setup
- 🔌 Request/response examples
- 🔄 Environment variables
- 📡 All HTTP methods (GET, POST, PUT, DELETE)
- 🧪 Multi-form requests for file uploads
- 📊 Pagination examples
- 🎯 Filter & search examples

**How to use**:
1. Import `Postman_Collection.json` into Postman
2. Set environment variables:
   - `baseUrl` = http://localhost:3000/api/v1
   - `accessToken` = obtained from login
   - `userId`, `eventId`, etc. from responses
3. Test endpoints one by one

---

## 🎯 Quick Start for Backend Dev

### Step 1: Review Documentation
```bash
1. Read API_DOCUMENTATION.md (understand API structure)
2. Read DATABASE_SCHEMA.md (understand data model)
3. Read BACKEND_IMPLEMENTATION_GUIDE.md (implementation roadmap)
```

### Step 2: Setup Project
```bash
npm init -y
npm install express express-async-errors dotenv pg pg-promise firebase-admin \
  jsonwebtoken bcryptjs stripe aws-sdk multer axios joi express-rate-limit \
  cors helmet winston uuid moment

npm install -D typescript @types/express @types/node ts-node nodemon jest ts-jest
```

### Step 3: Create .env File
```bash
# Copy from BACKEND_IMPLEMENTATION_GUIDE.md env section
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/event_photos_db
FIREBASE_PROJECT_ID=your_project_id
# ... rest of variables
```

### Step 4: Setup Database
```bash
# Create PostgreSQL database
createdb event_photos_db

# Run migrations (see DATABASE_SCHEMA.md)
# Copy SQL scripts and run them in psql
```

### Step 5: Start Coding
- Create `src/app.ts` (Express setup)
- Implement modules in order (Auth → Users → Events → Photos → Faces)
- Use API_TYPES.ts for TypeScript interfaces
- Test with Postman_Collection.json

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────┐
│     Frontend (React/React Native)    │
└──────────────┬──────────────────────┘
               │
               │ HTTP/JSON
               │
┌──────────────▼──────────────────────┐
│    Express.js API Server             │
│  - Authentication (JWT + Firebase)   │
│  - CRUD Operations                   │
│  - File Upload (S3)                  │
│  - Face Detection (Azure/AWS)        │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┬────────────────┐
       │                │                │
       ▼                ▼                ▼
   ┌─────────┐   ┌──────────┐   ┌──────────────┐
   │PostgreSQL│   │  S3 CDN  │   │Face API      │
   │Database  │   │  Images  │   │Detection     │
   └──────────┘   └──────────┘   └──────────────┘
```

---

## 📊 API Endpoints Summary

### Authentication (6 endpoints)
- POST `/auth/signup` - Register user
- POST `/auth/login/email` - Email login
- POST `/auth/login/google` - Google OAuth
- POST `/auth/login/apple` - Apple OAuth
- POST `/auth/logout` - Sign out
- POST `/auth/refresh` - Refresh token

### Users (4 endpoints)
- GET `/auth/me` - Current user
- PUT `/users/{userId}` - Update profile
- GET `/users/{userId}/subscription` - Subscription info
- POST `/users/{userId}/upgrade` - Upgrade plan

### Events (6 endpoints)
- POST `/events` - Create event
- GET `/events/{eventId}` - Get details
- GET `/events` - List user events
- PUT `/events/{eventId}` - Update event
- DELETE `/events/{eventId}` - Delete event
- GET `/events/{eventId}/stats` - Statistics

### Photos (4 endpoints)
- POST `/events/{eventId}/photos` - Upload
- GET `/events/{eventId}/photos` - List
- GET `/events/{eventId}/photos/{photoId}` - Details
- DELETE `/events/{eventId}/photos/{photoId}` - Delete

### Participants (4 endpoints)
- POST `/events/{eventId}/participants` - Add
- GET `/events/{eventId}/participants` - List
- DELETE `/events/{eventId}/participants/{userId}` - Remove
- POST `/events/join` - Join by link

### Face Detection (3 endpoints)
- POST `/photos/{photoId}/detect-faces` - Detect
- POST `/events/{eventId}/find-faces` - Find
- GET `/events/{eventId}/participant-photos/{userId}` - Get photos

### Public (2 endpoints)
- GET `/public/events/{shareToken}` - Public event
- GET `/public/events/{shareToken}/photos` - Public photos

---

## 🔐 Authentication Flow

```
1. User Signs Up
   ├─ POST /auth/signup
   ├─ Firebase creates account
   ├─ Backend creates user in DB
   └─ Returns JWT token + user data

2. User Logs In
   ├─ POST /auth/login/email
   ├─ Verify credentials (Firebase or DB)
   ├─ Generate JWT token
   └─ Return token + user data

3. OAuth (Google/Apple)
   ├─ Frontend gets OAuth token from provider
   ├─ POST /auth/login/google or /auth/login/apple
   ├─ Backend verifies token with provider
   ├─ Create/update user in DB
   └─ Return JWT token

4. Token Usage
   ├─ Client sends: Authorization: Bearer {token}
   ├─ Backend verifies JWT
   ├─ Sets req.userId from token
   └─ Execute endpoint logic

5. Token Refresh
   ├─ POST /auth/refresh with refreshToken
   ├─ Backend validates refresh token
   ├─ Issues new access token
   └─ Return new token
```

---

## 📦 Subscription Tiers

### Free Plan
- Max 50 photos
- Max 1 event
- 5GB storage
- 100 API requests/hour
- 10 face detections/hour
- Basic face detection
- Standard support

### Premium Plan
- Unlimited photos
- Unlimited events
- 1TB storage
- 1000 API requests/hour
- Unlimited face detections
- Advanced face detection
- Priority support
- Batch processing

---

## 🗄️ Database Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| users | User accounts | id, email, subscription, photoCount |
| events | Event records | id, organizerId, status, shareToken |
| event_participants | User participation | eventId, userId, role |
| photos | Uploaded images | id, eventId, uploadedById, url |
| face_detections | Detected faces | id, photoId, faceEmbedding, confidence |
| face_matches | Face similarities | sourceId, matchedId, score |
| subscriptions | Payment info | userId, plan, status, stripId |
| audit_logs | Activity log | action, entityType, changes |

---

## 🔗 Frontend Integration

The frontend (already in `/src`) integrates with this backend:

**Frontend already uses**:
- `src/features/auth/services/authService.ts` - Calls `/auth/*` endpoints
- `src/features/events/services/eventService.ts` - Calls `/events/*` endpoints
- TypeScript types from API_TYPES.ts

**Frontend expects**:
- Bearer token authentication
- JSON request/response format
- Specific error response format
- CORS headers for cross-origin requests

---

## 🚀 Deployment Options

### Quick Deployment (Recommended for MVP)
```bash
# Railway (simplest)
railway link
railway up

# Render
git push render main

# Heroku
git push heroku main
```

### Production Deployment (Recommended for Scale)
```bash
# AWS EC2 + RDS
# DigitalOcean App Platform
# Kubernetes (advanced)
```

---

## 📊 Performance Optimization

1. **Database**: Indexes on user_id, event_id, created_at
2. **Caching**: Redis for sessions & popular events
3. **Images**: CDN delivery with CloudFront/Cloudflare
4. **Compression**: gzip for API responses
5. **Pagination**: Max 100 items per request
6. **Rate Limiting**: 100 (free) / 1000 (premium) req/hour

---

## 🔒 Security Checklist

- [ ] HTTPS everywhere
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Input validation (Joi)
- [ ] SQL injection prevention (parameterized queries)
- [ ] JWT validation on all endpoints
- [ ] Password hashing (bcrypt)
- [ ] File upload validation
- [ ] Firebase Auth verification
- [ ] Stripe webhook signature validation
- [ ] Environment variables secured
- [ ] Regular dependency updates
- [ ] Error logging without sensitive data

---

## 🧪 Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# Load testing (with wrk)
wrk -t12 -c400 -d30s http://localhost:3000/api/v1/health

# Manual testing
# Use Postman_Collection.json
```

---

## 📞 Support & Resources

### Documentation References
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Express.js**: https://expressjs.com/
- **Firebase Admin**: https://firebase.google.com/docs/admin/setup
- **Stripe API**: https://stripe.com/docs/api
- **AWS S3**: https://docs.aws.amazon.com/s3/

### Face Detection APIs
- **Azure Face API**: https://azure.microsoft.com/en-us/services/cognitive-services/face/
- **AWS Rekognition**: https://aws.amazon.com/rekognition/
- **Google Cloud Vision**: https://cloud.google.com/vision

### Testing Tools
- **Postman**: https://www.postman.com/
- **Thunder Client**: https://www.thunderclient.com/
- **REST Client (VSCode)**: https://marketplace.visualstudio.com/items?itemName=humao.rest-client

---

## 📝 File Manifest

```
📁 Project Root
├── 📄 API_DOCUMENTATION.md (30 endpoint specs)
├── 📄 API_TYPES.ts (TypeScript interfaces)
├── 📄 DATABASE_SCHEMA.md (PostgreSQL schemas)
├── 📄 BACKEND_IMPLEMENTATION_GUIDE.md (10-phase plan)
├── 📄 Postman_Collection.json (API testing)
└── 📄 README.md (this file)
```

---

## ⏱️ Estimated Timeline

| Phase | Duration | Task Count |
|-------|----------|-----------|
| Setup | 1 week | 8 tasks |
| Auth | 1-2 weeks | 6 endpoints |
| Users | 1 week | 4 endpoints |
| Events | 1-2 weeks | 6 endpoints |
| Photos | 1-2 weeks | 4 endpoints |
| Participants | 1 week | 4 endpoints |
| Face Detection | 1-2 weeks | 3 endpoints |
| Subscriptions | 1-2 weeks | 3 endpoints + webhooks |
| Testing | 1 week | Full coverage |
| Deployment | 1 week | Live server |
| **TOTAL** | **6-8 weeks** | **30 endpoints** |

*Timeline based on 1-2 developer team working full-time*

---

## ✅ Next Steps

1. **Review** API_DOCUMENTATION.md
2. **Understand** DATABASE_SCHEMA.md
3. **Follow** BACKEND_IMPLEMENTATION_GUIDE.md
4. **Setup** Node.js project with dependencies
5. **Create** database schema
6. **Implement** Auth module first
7. **Test** with Postman_Collection.json
8. **Continue** with remaining modules

---

## 🎉 Ready to Build!

Everything is documented and ready. Start with Phase 1 in BACKEND_IMPLEMENTATION_GUIDE.md.

**Good luck! 🚀**

---

**Documentation Version**: 1.0.0  
**Last Updated**: November 28, 2025  
**Status**: Ready for Development  
**API Version**: v1
