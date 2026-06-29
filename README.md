# LifeLink Frontend

This directory contains the React frontend for the LifeLink application, built with TanStack Start, React, and TailwindCSS.

## Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # External integrations (Supabase client)
│   ├── lib/              # Utility functions and helpers
│   ├── routes/           # Page routes
│   ├── types/            # TypeScript type definitions
│   ├── assets/           # Static assets
│   ├── server.ts         # Server entry point
│   ├── router.tsx        # Router configuration
│   └── start.ts          # Application entry point
├── package.json          # Frontend dependencies
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── .env                  # Environment variables
```

## Tech Stack

- **React 19** - UI library
- **TanStack Start** - Full-stack React framework
- **TanStack Router** - File-based routing
- **TanStack Query** - Data fetching and caching
- **TailwindCSS** - Styling
- **Radix UI** - Component library
- **Supabase** - Authentication and database client
- **Zod** - Schema validation

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Ensure `.env` file exists with:

```env
VITE_SUPABASE_PROJECT_ID=tsdnizxxjpxqotycaxdb
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
VITE_SUPABASE_URL=https://tsdnizxxjpxqotycaxdb.supabase.co
```

### 3. Run Development Server

```bash
npm run dev
```

The frontend will be available at: http://localhost:5173

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Pages

- **Home** (`/`) - Landing page with features and stats
- **Auth** (`/auth`) - Login/Register page
- **Smart Matching** (`/smart-matching`) - AI-powered donor matching
- **Donor Dashboard** (`/donor-dashboard`) - Donor stats, donations, achievements
- **Patient Dashboard** (`/patient-dashboard`) - Blood requests, tracking
- **Hospital Dashboard** (`/hospital-dashboard`) - Inventory, pending requests

## Backend Integration

The frontend communicates with the backend through:
1. **Supabase Client** - Direct database access with RLS policies
2. **Edge Functions** - Server-side logic for complex operations

Edge functions are called from the frontend using the Supabase client:
```typescript
const { data, error } = await supabase.functions.invoke('match-donors', {
  body: { blood_group: 'O+', latitude: 31.5204, longitude: 74.3587 }
})
```
