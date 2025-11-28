# 🗄️ Database Schema Documentation

## Overview
Complete PostgreSQL database schema for Event Photos Platform with relationships, constraints, and indexes.

---

## Table of Contents
1. [Users Table](#users-table)
2. [Events Table](#events-table)
3. [Event Participants Table](#event-participants-table)
4. [Photos Table](#photos-table)
5. [Face Detections Table](#face-detections-table)
6. [Face Matches Table](#face-matches-table)
7. [Subscriptions Table](#subscriptions-table)
8. [Audit Logs Table](#audit-logs-table)
9. [Indexes](#indexes)
10. [Views](#views)
11. [SQL Scripts](#sql-scripts)

---

## Users Table

### Schema
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  auth_provider VARCHAR(50) NOT NULL DEFAULT 'email',
  firebase_uid VARCHAR(255),
  google_id VARCHAR(255),
  apple_id VARCHAR(255),
  subscription VARCHAR(50) NOT NULL DEFAULT 'free',
  photo_count INT NOT NULL DEFAULT 0,
  max_photos INT NOT NULL DEFAULT 50,
  storage_used_bytes BIGINT NOT NULL DEFAULT 0,
  storage_limit_bytes BIGINT NOT NULL DEFAULT 5368709120,
  email_verified BOOLEAN DEFAULT false,
  two_fa_enabled BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_subscription CHECK (subscription IN ('free', 'premium')),
  CONSTRAINT valid_auth_provider CHECK (auth_provider IN ('email', 'google', 'apple'))
);
```

### Columns
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key, unique user identifier |
| email | VARCHAR(255) | NO | - | User email address (unique) |
| password_hash | VARCHAR(255) | YES | - | Hashed password (null for OAuth users) |
| name | VARCHAR(255) | NO | - | User full name |
| avatar_url | TEXT | YES | - | Avatar image URL |
| auth_provider | VARCHAR(50) | NO | 'email' | Authentication method used |
| firebase_uid | VARCHAR(255) | YES | - | Firebase UID for auth integration |
| google_id | VARCHAR(255) | YES | - | Google ID for OAuth |
| apple_id | VARCHAR(255) | YES | - | Apple ID for OAuth |
| subscription | VARCHAR(50) | NO | 'free' | Current subscription plan |
| photo_count | INT | NO | 0 | Total photos uploaded by user |
| max_photos | INT | NO | 50 | Photo limit based on subscription |
| storage_used_bytes | BIGINT | NO | 0 | Storage used in bytes |
| storage_limit_bytes | BIGINT | NO | 5368709120 | Storage limit in bytes (5GB free) |
| email_verified | BOOLEAN | NO | false | Email verification status |
| two_fa_enabled | BOOLEAN | NO | false | Two-factor authentication enabled |
| last_login_at | TIMESTAMP | YES | - | Last login timestamp |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Last update time |
| deleted_at | TIMESTAMP | YES | - | Soft delete timestamp |

### Indexes
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_apple_id ON users(apple_id);
CREATE INDEX idx_users_subscription ON users(subscription);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
```

---

## Events Table

### Schema
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  share_link VARCHAR(255) UNIQUE NOT NULL,
  share_token VARCHAR(255) UNIQUE NOT NULL,
  qr_code_data TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  allow_uploads BOOLEAN NOT NULL DEFAULT true,
  max_participants INT,
  participant_count INT NOT NULL DEFAULT 1,
  photo_count INT NOT NULL DEFAULT 0,
  face_detection_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'completed'))
);
```

### Columns
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key, unique event identifier |
| organizer_id | UUID | NO | - | Foreign key to users table |
| title | VARCHAR(255) | NO | - | Event title |
| description | TEXT | YES | - | Event description |
| status | VARCHAR(50) | NO | 'draft' | Event status (draft, active, completed) |
| share_link | VARCHAR(255) | NO | - | Unique public share link |
| share_token | VARCHAR(255) | NO | - | Token for share link authentication |
| qr_code_data | TEXT | YES | - | QR code as data URI or URL |
| is_public | BOOLEAN | NO | false | Event is publicly accessible |
| allow_uploads | BOOLEAN | NO | true | Participants can upload photos |
| max_participants | INT | YES | - | Maximum participants allowed |
| participant_count | INT | NO | 1 | Current participant count |
| photo_count | INT | NO | 0 | Total photos in event |
| face_detection_count | INT | NO | 0 | Total faces detected |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Event creation time |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Last update time |
| deleted_at | TIMESTAMP | YES | - | Soft delete timestamp |

### Indexes
```sql
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_share_token ON events(share_token);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_is_public ON events(is_public);
CREATE INDEX idx_events_deleted_at ON events(deleted_at);
```

---

## Event Participants Table

### Schema
```sql
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'participant',
  can_upload BOOLEAN NOT NULL DEFAULT true,
  can_delete_own_photos BOOLEAN NOT NULL DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT unique_event_user UNIQUE(event_id, user_id),
  CONSTRAINT valid_role CHECK (role IN ('organizer', 'participant', 'guest'))
);
```

### Columns
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| event_id | UUID | NO | - | Foreign key to events |
| user_id | UUID | NO | - | Foreign key to users |
| role | VARCHAR(50) | NO | 'participant' | User role in event |
| can_upload | BOOLEAN | NO | true | Permission to upload photos |
| can_delete_own_photos | BOOLEAN | NO | true | Permission to delete own photos |
| joined_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Join timestamp |
| left_at | TIMESTAMP | YES | - | Leave timestamp (if applicable) |

### Indexes
```sql
CREATE INDEX idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX idx_event_participants_user_id ON event_participants(user_id);
CREATE INDEX idx_event_participants_role ON event_participants(role);
CREATE UNIQUE INDEX idx_unique_event_participant ON event_participants(event_id, user_id) WHERE left_at IS NULL;
```

---

## Photos Table

### Schema
```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  uploaded_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes INT NOT NULL,
  mime_type VARCHAR(50) NOT NULL,
  original_url TEXT NOT NULL,
  thumbnail_url TEXT,
  compressed_url TEXT,
  width INT,
  height INT,
  orientation INT DEFAULT 1,
  exif_data JSONB,
  camera_model VARCHAR(255),
  taken_at TIMESTAMP WITH TIME ZONE,
  face_detection_status VARCHAR(50) DEFAULT 'pending',
  faces_count INT DEFAULT 0,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_mime_type CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif')),
  CONSTRAINT valid_detection_status CHECK (face_detection_status IN ('pending', 'processing', 'completed', 'failed'))
);
```

### Columns
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| event_id | UUID | NO | - | Foreign key to events |
| uploaded_by_id | UUID | NO | - | Foreign key to users (uploader) |
| file_name | VARCHAR(255) | NO | - | Original file name |
| file_size_bytes | INT | NO | - | File size in bytes |
| mime_type | VARCHAR(50) | NO | - | MIME type of image |
| original_url | TEXT | NO | - | URL to original image |
| thumbnail_url | TEXT | YES | - | URL to thumbnail |
| compressed_url | TEXT | YES | - | URL to compressed version |
| width | INT | YES | - | Image width in pixels |
| height | INT | YES | - | Image height in pixels |
| orientation | INT | NO | 1 | EXIF orientation value |
| exif_data | JSONB | YES | - | EXIF metadata |
| camera_model | VARCHAR(255) | YES | - | Camera model from EXIF |
| taken_at | TIMESTAMP | YES | - | Photo taken timestamp |
| face_detection_status | VARCHAR(50) | NO | 'pending' | Face detection status |
| faces_count | INT | NO | 0 | Number of faces detected |
| is_deleted | BOOLEAN | NO | false | Soft delete flag |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Upload timestamp |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Last update time |

### Indexes
```sql
CREATE INDEX idx_photos_event_id ON photos(event_id);
CREATE INDEX idx_photos_uploaded_by_id ON photos(uploaded_by_id);
CREATE INDEX idx_photos_face_detection_status ON photos(face_detection_status);
CREATE INDEX idx_photos_created_at ON photos(created_at);
CREATE INDEX idx_photos_taken_at ON photos(taken_at);
```

---

## Face Detections Table

### Schema
```sql
CREATE TABLE face_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  face_embedding VECTOR(128),
  bounding_box JSONB NOT NULL,
  landmarks JSONB,
  confidence FLOAT NOT NULL,
  face_quality FLOAT,
  age_estimate INT,
  gender_estimate VARCHAR(50),
  emotion_estimate VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Columns
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| photo_id | UUID | NO | - | Foreign key to photos |
| face_embedding | VECTOR(128) | YES | - | Face embedding vector for matching |
| bounding_box | JSONB | NO | - | Bounding box coordinates {x, y, width, height} |
| landmarks | JSONB | YES | - | Facial landmarks {eyes, nose, mouth, etc} |
| confidence | FLOAT | NO | - | Detection confidence score (0-1) |
| face_quality | FLOAT | YES | - | Face quality score |
| age_estimate | INT | YES | - | Estimated age |
| gender_estimate | VARCHAR(50) | YES | - | Estimated gender |
| emotion_estimate | VARCHAR(50) | YES | - | Estimated dominant emotion |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Detection timestamp |

### Indexes
```sql
CREATE INDEX idx_face_detections_photo_id ON face_detections(photo_id);
CREATE INDEX idx_face_detections_confidence ON face_detections(confidence);
```

---

## Face Matches Table

### Schema
```sql
CREATE TABLE face_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_face_id UUID NOT NULL REFERENCES face_detections(id) ON DELETE CASCADE,
  matched_face_id UUID NOT NULL REFERENCES face_detections(id) ON DELETE CASCADE,
  similarity_score FLOAT NOT NULL,
  user_labeled_as UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT no_self_match CHECK (source_face_id != matched_face_id)
);
```

### Columns
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| source_face_id | UUID | NO | - | Foreign key to source face detection |
| matched_face_id | UUID | NO | - | Foreign key to matched face detection |
| similarity_score | FLOAT | NO | - | Similarity score (0-1) |
| user_labeled_as | UUID | YES | - | User labeled this match as |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Match detection time |

### Indexes
```sql
CREATE INDEX idx_face_matches_source_face_id ON face_matches(source_face_id);
CREATE INDEX idx_face_matches_matched_face_id ON face_matches(matched_face_id);
CREATE INDEX idx_face_matches_similarity_score ON face_matches(similarity_score DESC);
```

---

## Subscriptions Table

### Schema
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ends_at TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN NOT NULL DEFAULT true,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  billing_cycle VARCHAR(50) NOT NULL DEFAULT 'monthly',
  amount_cents INT,
  currency VARCHAR(3) DEFAULT 'USD',
  next_billing_date TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_plan CHECK (plan IN ('free', 'premium')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'canceled')),
  CONSTRAINT valid_billing_cycle CHECK (billing_cycle IN ('monthly', 'yearly'))
);
```

### Columns
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | NO | - | Foreign key to users (unique) |
| plan | VARCHAR(50) | NO | - | Subscription plan |
| status | VARCHAR(50) | NO | 'active' | Subscription status |
| started_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Subscription start date |
| ends_at | TIMESTAMP | YES | - | Subscription end date |
| auto_renew | BOOLEAN | NO | true | Auto-renewal enabled |
| stripe_subscription_id | VARCHAR(255) | YES | - | Stripe subscription ID |
| stripe_customer_id | VARCHAR(255) | YES | - | Stripe customer ID |
| billing_cycle | VARCHAR(50) | NO | 'monthly' | Billing period |
| amount_cents | INT | YES | - | Monthly/yearly amount in cents |
| currency | VARCHAR(3) | NO | 'USD' | Currency code |
| next_billing_date | TIMESTAMP | YES | - | Next billing date |
| canceled_at | TIMESTAMP | YES | - | Cancellation date |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Last update time |

### Indexes
```sql
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
```

---

## Audit Logs Table

### Schema
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Columns
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | YES | - | Foreign key to users who performed action |
| action | VARCHAR(255) | NO | - | Action performed (create, update, delete) |
| entity_type | VARCHAR(100) | NO | - | Entity type affected (event, photo, user) |
| entity_id | UUID | YES | - | ID of affected entity |
| changes | JSONB | YES | - | Details of changes made |
| ip_address | INET | YES | - | IP address of request |
| user_agent | TEXT | YES | - | User agent string |
| status | VARCHAR(50) | NO | - | Action status (success, failed) |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | Log timestamp |

### Indexes
```sql
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

---

## Views

### User Statistics View
```sql
CREATE VIEW user_statistics AS
SELECT 
  u.id,
  u.email,
  u.name,
  u.subscription,
  u.photo_count,
  u.max_photos,
  COUNT(DISTINCT e.id) as event_count,
  COUNT(DISTINCT ep.id) as participant_in_count,
  u.storage_used_bytes,
  u.storage_limit_bytes,
  ROUND(u.storage_used_bytes * 100.0 / u.storage_limit_bytes, 2) as storage_usage_percent
FROM users u
LEFT JOIN events e ON u.id = e.organizer_id AND e.deleted_at IS NULL
LEFT JOIN event_participants ep ON u.id = ep.user_id AND ep.left_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id;
```

### Event Details View
```sql
CREATE VIEW event_details_view AS
SELECT 
  e.id,
  e.title,
  e.description,
  e.status,
  u.name as organizer_name,
  u.email as organizer_email,
  COUNT(DISTINCT ep.user_id) as participant_count,
  COUNT(DISTINCT p.id) as photo_count,
  SUM(CASE WHEN fd.id IS NOT NULL THEN 1 ELSE 0 END) as total_faces_detected,
  e.created_at,
  e.updated_at
FROM events e
LEFT JOIN users u ON e.organizer_id = u.id
LEFT JOIN event_participants ep ON e.id = ep.event_id AND ep.left_at IS NULL
LEFT JOIN photos p ON e.id = p.event_id AND p.is_deleted = false
LEFT JOIN face_detections fd ON p.id = fd.photo_id
WHERE e.deleted_at IS NULL
GROUP BY e.id, u.name, u.email;
```

---

## SQL Scripts

### Initial Setup
```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS public;

-- Create tables (copy from schemas above)
-- ...
```

### Migration: Add Free Plan Limits
```sql
ALTER TABLE users 
ADD COLUMN max_photos INT NOT NULL DEFAULT 50,
ADD COLUMN photo_count INT NOT NULL DEFAULT 0;

UPDATE users 
SET max_photos = CASE 
  WHEN subscription = 'premium' THEN 999999
  ELSE 50 
END;
```

### Cleanup: Soft Delete Cascade
```sql
-- Archive deleted user's events
CREATE FUNCTION archive_user_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events 
  SET deleted_at = NOW() 
  WHERE organizer_id = OLD.id AND deleted_at IS NULL;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER archive_user_events_trigger
BEFORE UPDATE OF deleted_at ON users
FOR EACH ROW
WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
EXECUTE FUNCTION archive_user_on_delete();
```

### Triggers: Update Timestamps
```sql
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at
BEFORE UPDATE ON photos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### Procedure: Calculate User Storage
```sql
CREATE OR REPLACE FUNCTION recalculate_user_storage(user_id UUID)
RETURNS BIGINT AS $$
DECLARE
  total_bytes BIGINT;
BEGIN
  SELECT COALESCE(SUM(p.file_size_bytes), 0)
  INTO total_bytes
  FROM photos p
  JOIN events e ON p.event_id = e.id
  WHERE p.uploaded_by_id = user_id AND p.is_deleted = false;
  
  UPDATE users
  SET storage_used_bytes = total_bytes
  WHERE id = user_id;
  
  RETURN total_bytes;
END;
$$ LANGUAGE plpgsql;
```

### Procedure: Update Event Statistics
```sql
CREATE OR REPLACE FUNCTION update_event_statistics(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE events e
  SET 
    photo_count = (
      SELECT COUNT(*) FROM photos 
      WHERE event_id = e.id AND is_deleted = false
    ),
    face_detection_count = (
      SELECT COUNT(*) FROM face_detections fd
      JOIN photos p ON fd.photo_id = p.id
      WHERE p.event_id = e.id AND p.is_deleted = false
    ),
    participant_count = (
      SELECT COUNT(*) FROM event_participants 
      WHERE event_id = e.id AND left_at IS NULL
    ),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;
```

---

## Data Relationships

```
users (1) ──── (many) events (organizer_id)
     │
     └──── (many) event_participants
                  │
                  └──── (1) events

users (1) ──── (many) photos (uploaded_by_id)
     │
     └──── (1) subscriptions

events (1) ──── (many) photos
         │
         └──── (many) event_participants
         │
         └──── (many) face_detections (via photos)

photos (1) ──── (many) face_detections
       │
       └──── (many) face_matches

face_detections (1) ──── (many) face_matches
```

---

## Query Optimization Tips

1. **Always filter by `deleted_at IS NULL`** for soft deletes
2. **Use pagination** for large result sets (limit 20-100)
3. **Index frequently filtered columns**: user_id, event_id, status, created_at
4. **Use JSONB operators** for efficient metadata queries
5. **Denormalize counts** for performance (photo_count, participant_count, faces_count)
6. **Consider materialized views** for complex aggregations
7. **Archive old photos** to separate cold storage after 90 days

---

## Backup & Recovery

```sql
-- Create backup
pg_dump event_photos_db > backup.sql

-- Restore from backup
psql event_photos_db < backup.sql

-- Point-in-time recovery (using WAL)
pg_basebackup -h localhost -D /path/to/backup
```

---

**Last Updated**: November 28, 2025
**Database Version**: PostgreSQL 14+
**Vector Extension**: pgvector for face embeddings
