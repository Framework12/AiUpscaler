# Image Upscaler

A modern, full-stack web application that uses AI to upscale and enhance images. Features include complete user authentication, real-time credit management, image processing history, and persistent sessions.

## Brief Description of My Approach

This project implements a client-server architecture with a focus on security, user experience, and real-time data synchronization:

1. **Frontend (Next.js + React)** - Built a responsive UI with React hooks for state management, implementing real-time credit updates and session persistence
2. **Backend (Next.js API Routes)** - Created secure API endpoints that act as a proxy between the client and external services, handling authentication, credit management, and data validation
3. **Database (Supabase PostgreSQL)** - Designed a normalized schema with Row Level Security policies to ensure data isolation between users
4. **AI Processing (Clipdrop API)** - Integrated external AI service for image upscaling with proper error handling and timeout management

Key architectural decisions:
- Used TypeScript throughout for type safety and better developer experience
- Implemented automatic profile creation via PostgreSQL triggers to prevent race conditions
- Separated client-side (anon key) and server-side (service_role key) Supabase operations for security
- Built a custom `refreshUser()` function to update UI state without page refreshes

---

## Tech Stack Used and Why

### Core Technologies

**Next.js 16 (React 19)**
- Chosen for its full-stack capabilities with built-in API routes
- Server-side rendering improves SEO and initial load times
- File-based routing simplifies navigation structure
- React 19's improved hooks and concurrent features enhance performance

**TypeScript**
- Provides type safety, reducing runtime errors
- Improves code maintainability and developer experience
- Enables better IDE support with autocomplete and refactoring
- Critical for a growing project with multiple developers

**Tailwind CSS v4**
- Utility-first approach speeds up UI development
- Consistent design system without writing custom CSS
- Built-in responsive design utilities
- Small bundle size with automatic purging

**Supabase (PostgreSQL)**
- Open-source Firebase alternative with full PostgreSQL power
- Built-in authentication system saves development time
- Row Level Security provides database-level access control
- Real-time subscriptions for future features
- Auto-generated REST APIs reduce boilerplate

**Clipdrop API**
- Production-ready AI models without infrastructure management
- Simple REST API integration
- Reliable upscaling quality
- Pay-per-use pricing model

### Supporting Libraries

- `@supabase/supabase-js` - Official Supabase client
- `uuid` - Generate unique identifiers for images
- `next/image` - Optimized image loading

---

## Setup Instructions for Local Development

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Git
- Supabase account
- Clipdrop API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ImageUpscaler
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase Dashboard
3. Open `supabase-setup.sql` from this project
4. Copy and paste the entire SQL script
5. Click "Run" to execute

This creates:
- `profiles` table with credit system
- `images` table for upscale history
- Automatic profile creation trigger
- Row Level Security policies

### 4. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Clipdrop API Key
CLIPBOARD_API_KEY=your_clipdrop_api_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key

# Server-side only (never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Where to get keys:**
- Supabase: Dashboard → Settings → API
  - Use `anon public` key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Use `service_role` key for `SUPABASE_SERVICE_ROLE_KEY`
- Clipdrop: [clipdrop.co/apis](https://clipdrop.co/apis)

### 5. (Optional) Disable Email Confirmation for Testing

1. Go to Supabase Dashboard → Authentication → Providers
2. Find "Email" provider
3. Toggle "Confirm email" to OFF
4. Click "Save"

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 7. Test the Application

1. Click "Start Free Trial" → Create account
2. Upload an image (max 10MB)
3. Click "Upscale" button
4. View result and download
5. Check `/history` for all upscaled images
6. Check `/dashboard` for stats

---

## Challenges Faced and How I Solved Them

### 1. Missing Profile on User Signup
**Challenge**: Users were created in `auth.users` but profiles weren't being created in the `profiles` table, causing "profile not found" errors.

**Solution**: 
- Created a PostgreSQL trigger `on_auth_user_created` that automatically creates a profile when a user signs up
- Added error handling in `UserContext` to provide fallback values if profile fetch fails
- Implemented a SQL script (`fix-missing-profiles.sql`) to retroactively create profiles for existing users

### 2. Session Not Persisting Across Page Refreshes
**Challenge**: Users were being logged out when refreshing the page, despite Supabase supporting session persistence.

**Solution**:
- Configured Supabase client with `persistSession: true` and `autoRefreshToken: true`
- Added a `loading` state to `UserContext` to prevent premature redirects
- Modified dashboard to wait for session check before redirecting to signin
- Added proper session initialization in `useEffect` hook

### 3. Credits Not Updating in Real-time
**Challenge**: After upscaling an image, credits were deducted in the database but the UI still showed the old value until page refresh.

**Solution**:
- Implemented `refreshUser()` function in `UserContext` to fetch latest profile data
- Called `refreshUser()` after successful upscale in `useImageUploader` hook
- Fixed incorrect usage of `refreshUser` by properly destructuring it from context
- Added console logging to track refresh flow

### 4. Incorrect RPC Function Call in Credits API
**Challenge**: The credits deduction API was failing with error "invalid input syntax for type integer" when trying to increment `total_upscales`.

**Solution**:
- Removed incorrect `supabaseAdmin.rpc('increment')` call
- Changed to simple arithmetic: `total_upscales: (profile.total_upscales || 0) + 1`
- Added `total_upscales` to the initial SELECT query
- Simplified the update logic to use calculated values

### 5. File Size Limit Too Restrictive
**Challenge**: Users couldn't upload images larger than 2MB, which was too limiting for high-quality photos.

**Solution**:
- Increased `MAX_FILE_SIZE_MB` from 2MB to 10MB in `useImageUploader` hook
- Updated UI text to reflect new limit
- Added detailed console logging to help debug file rejection issues
- Implemented proper error messages showing which files were rejected and why


### 6. Dashboard Redirecting to Signin Immediately
**Challenge**: Dashboard would redirect to signin page even for authenticated users because the user state was null during initial load.

**Solution**:
- Added `loading` state to track session initialization
- Modified redirect logic to wait for `!loading && !user` before redirecting
- Added loading spinner UI while checking session
- Prevented race condition between session check and redirect

---

## Time Spent on the Project

- **Initial Setup & Scaffolding**: ~1 hour
- **UI/UX Development**: ~3 hours
- **Core Feature Integration (Supabase & Clipdrop API)**: ~3 hours
- **Debugging & Refinements**: ~2 hours

**Total Time**: ~9 hours

---

## What I Would Improve with More Time

**1. Migrate to Supabase Storage for Images**
- Currently using base64 encoding which increases database size significantly
- Implement Supabase Storage buckets for efficient file management
- Generate signed URLs for secure, temporary image access
- This would improve performance and reduce database costs

**2. Asynchronous Processing with Webhooks**
- Transition from synchronous API calls to a webhook-based system
- Allow UI to remain responsive while AI processes images in the background
- Implement job queue (e.g., Bull/Redis) for handling multiple requests
- Add real-time notifications when processing completes

**3. Payment Integration (Stripe)**
- Integrate Stripe for credit purchases and subscription plans
- Implement tiered pricing (Basic, Pro, Enterprise)
- Add webhook handlers for payment events
- Create a production-ready monetization system

**4. Enhanced Security & Production Readiness**
- Add rate limiting middleware to prevent API abuse
- Implement email verification for new signups
- Add password reset functionality
- Set up monitoring with Sentry for error tracking
- Add comprehensive unit and integration tes
- Add CAPTCHA for signup/signin

**5. Batch Image Processing**
- Allow users to upscale multiple images simultaneously
- Implement queue system for processing
- Show progress for each image
- Add "Upscale All" functionality