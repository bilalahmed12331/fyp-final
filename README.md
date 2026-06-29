# LifeLink Backend

This directory contains the backend components for the LifeLink application, including Supabase edge functions and database schema.

## Structure

```
backend/
├── supabase/
│   ├── functions/          # Supabase Edge Functions
│   │   ├── match-donors/
│   │   ├── create-sos-request/
│   │   ├── update-request-status/
│   │   ├── get-tracking-data/
│   │   └── get-dashboard-stats/
│   ├── config.toml        # Supabase configuration
│   └── migrations/        # Database migrations
├── 01-tables.sql          # Database tables schema
├── 02-rls-policies.sql    # Row Level Security policies
├── 03-auth-setup.sql      # Auth triggers and helper functions
├── 04-sample-data.sql     # Sample data for testing
└── package.json           # Backend dependencies
```

## Edge Functions

1. **match-donors**: Finds compatible donors by blood group and location
2. **create-sos-request**: Creates blood request with auto-generated code
3. **update-request-status**: Updates request status and handles rewards
4. **get-tracking-data**: Returns tracking info for a request
5. **get-dashboard-stats**: Returns role-specific dashboard statistics

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Link to Supabase Project

```bash
supabase link --project-ref tsdnizxxjpxqotycaxdb
```

### 3. Deploy Edge Functions

```bash
# Deploy all functions
npm run deploy:functions

# Or deploy individual functions
npm run deploy:match-donors
npm run deploy:create-sos-request
# etc.
```

## Database Setup

Run the SQL scripts in the Supabase Dashboard in this order:

1. `01-tables.sql` - Create tables
2. `02-rls-policies.sql` - Setup RLS policies
3. `03-auth-setup.sql` - Setup auth triggers
4. `04-sample-data.sql` - (Optional) Add sample data

## Environment Variables

Create a `.env` file in the `supabase` directory:

```env
SUPABASE_URL=https://tsdnizxxjpxqotycaxdb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```
