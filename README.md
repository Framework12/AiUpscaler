# Image Upscaler

A modern, full-stack web application that uses AI to upscale and enhance images. It features a complete user authentication system, credit management, and image processing history, built with Next.js, Tailwind CSS and Supabase.

## Architecture

The application follows a client-server architecture:

1.  **Frontend (Next.js)**: A responsive user interface for image uploading, user authentication, and viewing results. The UI communicates with our own Next.js API layer.
2.  **Backend (Next.js API Routes)**: Handles business logic, user authentication, and acts as a proxy to external services. It validates requests, communicates with Supabase for data persistence, and calls the Clipdrop API for image processing.
3.  **Database (Supabase - PostgreSQL)**: Stores user profiles, authentication data, image history, and credit information. Row Level Security (RLS) is enabled to ensure users can only access their own data.
4.  **AI Processing (Clipdrop API)**: An external service that runs the AI model (`clipdrop/clipdrop-upscale`) to perform the actual image upscaling.

## Tech Stack & Justification

-   **Framework**: **Next.js** (React) - Chosen for its powerful full-stack capabilities, including server-side rendering, API routes, and a great developer experience.
-   **Database & Auth**: **Supabase** - Selected as an open-source Firebase alternative. It provides a PostgreSQL database, user authentication, and auto-generated APIs, which significantly sped up development.
-   **Styling**: **Tailwind CSS** - A utility-first CSS framework that allows for rapid UI development without leaving the HTML.
-   **Language**: **TypeScript** - For type safety and improved code quality, which is crucial for a growing project.
-   **AI Model Hosting**: **Clipdrop** - Simplifies running machine learning models by providing a straightforward API, abstracting away the complexities of infrastructure management.

## Setup Instructions for Local Development

### Prerequisites
-   Node.js (v18)
-   npm or yarn
-   Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a file named `.env.local` in the root of the project and add the following variables:

```env
# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clipdrop API token for image upscaling
CLIPBOARD_API_KEY=Clipdrop_api_token
```

-   You can get your Supabase keys from your project's dashboard under `Project Settings > API`.
-   You can get your Clipdrop API token from the [Clipdrop website](https://clipdrop.co/apis).

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Key Technical Challenges

-   **Data Consistency**: Ensured reliable user profile creation by implementing a **PostgreSQL trigger** in Supabase, which automatically creates a profile on user signup, solving race conditions and potential errors.

-   **Database Schema Design**: Resolved critical foreign key constraint errors by aligning our `profiles` table schema with Supabase's `auth.users` table, specifically by changing the primary key from `bigint` to `UUID`.

-   **Data Security**: Implemented **Row Level Security (RLS)** policies on all user-related tables to guarantee that users can only ever access their own data, preventing unauthorized data exposure.

## Time Spent on the Project

-   **Initial Setup & Scaffolding**: ~1 hour
-   **UI/UX Development**: ~3 hours
-   **Core Feature Integration (Supabase & AI)**: ~3 hours
-   **Debugging & Refinements**: ~2 hours
-   **Total Estimated Time**: ~9 hours

## Potential Future Improvements

-   **Asynchronous AI Processing**: Transition from synchronous API calls to a webhook-based system. This would allow the UI to remain responsive while the AI model processes in the background, improving user experience and scalability.

-   **Monetization**: Integrate **Stripe** to introduce credit packs and subscription tiers, creating a path to a production-ready SaaS application.

-   **Enhanced User Features**: Implement batch image upscaling and add advanced features to the user's image history, such as search and filtering capabilities.
