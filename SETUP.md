# LifeLink - Complete Setup Guide

This guide will help you set up and run the complete LifeLink application with Supabase backend and React frontend.

## Prerequisites

- Node.js (v18+) installed
- Supabase CLI installed (for deploying edge functions)
- A Supabase project (already created: `tsdnizxxjpxqotycaxdb`)
- Git
- Railway account (for production deployment)
- GitHub account (for CI/CD)

## Project Structure

```
lifelink-source/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── integrations/supabase/  # Supabase client and types
│   │   ├── lib/
│   │   │   ├── auth.tsx           # Auth context
│   │   │   └── supabase-helpers.ts # Edge function helpers
│   │   └── routes/                # Frontend pages
│   ├── package.json
│   └── README.md
├── backend/                   # Supabase backend
│   ├── 01-tables.sql              # Database tables schema
│   ├── 02-rls-policies.sql        # Row Level Security policies
│   ├── 03-auth-setup.sql          # Auth triggers and helper functions
│   ├── 04-sample-data.sql         # Sample data for testing
│   ├── supabase/
│   │   └── functions/             # Edge functions
│   │       ├── match-donors/
│   │       ├── create-sos-request/
│   │       ├── update-request-status/
│   │       ├── get-tracking-data/
│   │       └── get-dashboard-stats/
│   ├── package.json
│   └── README.md
└── SETUP.md
```

## Step 1: Setup Supabase Database

### 1.1 Run SQL Scripts in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/tsdnizxxjpxqotycaxdb/sql/new
2. Run the scripts in this exact order:

**Script 1: Create Tables**
```bash
# Copy the contents of 01-tables.sql and paste in the SQL editor
# Click "Run" to execute
```

**Script 2: Setup RLS Policies**
```bash
# Copy the contents of 02-rls-policies.sql and paste
# Click "Run" to execute
```

**Script 3: Setup Auth**
```bash
# Copy the contents of 03-auth-setup.sql and paste
# Click "Run" to execute
```

**Script 4: Sample Data (Optional)**
```bash
# Copy the contents of 04-sample-data.sql and paste
# Click "Run" to execute
# This creates sample donors, hospitals, and requests for testing
```

### 1.2 Enable Realtime

In Supabase Dashboard:
1. Go to Database → Replication
2. Enable Realtime for tables: `blood_requests`, `donor_responses`, `notifications`

## Step 2: Deploy Edge Functions

### 2.1 Install Supabase CLI (if not installed)

```bash
npm install -g supabase
```

### 2.2 Login to Supabase

```bash
supabase login
```

### 2.3 Link to Your Project

```bash
cd backend
supabase link --project-ref tsdnizxxjpxqotycaxdb
```

### 2.4 Get Service Role Key

1. Go to: https://supabase.com/dashboard/project/tsdnizxxjpxqotycaxdb/settings/api
2. Copy the `service_role` key
3. Create a `.env` file in `backend/supabase`:
```env
SUPABASE_URL=https://tsdnizxxjpxqotycaxdb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2.5 Deploy Edge Functions

```bash
# Deploy all edge functions
cd backend
npm run deploy:functions

# Or deploy individual functions
npm run deploy:match-donors
npm run deploy:create-sos-request
npm run deploy:update-request-status
npm run deploy:get-tracking-data
npm run deploy:get-dashboard-stats
```

## Step 3: Setup Frontend

### 3.1 Install Dependencies

```bash
cd frontend
npm install
```

### 3.2 Verify Environment Variables

Check that `.env` file exists in the `frontend` directory with:
```env
VITE_SUPABASE_PROJECT_ID=tsdnizxxjpxqotycaxdb
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_URL=https://tsdnizxxjpxqotycaxdb.supabase.co
```

### 3.3 Run the Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at: http://localhost:5173

## Step 4: Deploy to Railway (Production)

### 4.1 Setup Railway Project

1. **Create Railway Account**:
   - Go to [railway.app](https://railway.app) and sign up
   - Verify your email address

2. **Create New Project**:
   - Click "New Project" in Railway dashboard
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub account
   - Select your lifelink-source repository

### 4.2 Configure Environment Variables

In your Railway project settings, add the following environment variables:

```env
VITE_SUPABASE_PROJECT_ID=tsdnizxxjpxqotycaxdb
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
VITE_SUPABASE_URL=https://tsdnizxxjpxqotycaxdb.supabase.co
```

To get your publishable key:
1. Go to: https://supabase.com/dashboard/project/tsdnizxxjpxqotycaxdb/settings/api
2. Copy the `anon` (public) key

### 4.3 Setup GitHub Actions for Automatic Deployment

1. **Get Railway Token**:
   - Go to Railway account settings
   - Click on "API Tokens"
   - Generate a new token
   - Copy the token

2. **Add Token to GitHub Secrets**:
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `RAILWAY_TOKEN`
   - Value: Paste your Railway API token
   - Click "Add secret"

3. **Automatic Deployment**:
   - The GitHub Actions workflow (`.github/workflows/deploy-railway.yml`) is already configured
   - Every push to `main` or `master` branch will trigger automatic deployment
   - Monitor deployment in GitHub Actions tab

### 4.4 Manual Deployment (Optional)

If you prefer manual deployment:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy from project root
railway up
```

### 4.5 Verify Deployment

1. Go to your Railway project dashboard
2. Click on the deployed service
3. Click the generated URL to access your live application
4. Test all features to ensure everything works

## Step 5: Test the Application

### 5.1 Register a New User

1. Go to http://localhost:5173/auth
2. Click "Create account"
3. Fill in:
   - Full name
   - Email
   - Phone
   - City
   - Password
   - Select role (Donor, Patient, Hospital, or Admin)
4. Click "Create Account"

### 5.2 Test as a Donor

1. Register as a Donor
2. After registration, you'll be redirected to the Donor Dashboard
3. Update your donor profile (blood group, availability)
4. Check your dashboard stats and achievements

### 5.3 Test as a Patient

1. Register as a Patient
2. Go to Patient Dashboard
3. Click "New blood request"
4. Fill in:
   - Hospital name
   - Blood group
   - Units needed
   - City
   - Notes
   - Urgency
5. Submit the request
6. Check the request status and code

### 5.4 Test Smart Matching

1. Go to http://localhost:5173/smart-matching
2. Select blood group
3. Enter city and coordinates (latitude/longitude)
4. Click "Run Smart Match"
5. View matched donors with their distance and stats

### 5.5 Test as Hospital

1. Register as a Hospital
2. Go to Hospital Dashboard
3. View blood inventory
4. Check pending blood requests
5. View critical alerts

## Step 6: Verify Backend Integration

### 6.1 Check Database Tables

In Supabase Dashboard → Table Editor, verify:
- `profiles` - User profiles
- `donors` - Donor information
- `blood_requests` - Blood requests with request codes
- `donor_responses` - Donor responses to requests
- `hospitals` - Hospital information
- `blood_inventory` - Hospital blood inventory
- `donations` - Donation records
- `notifications` - User notifications

### 6.2 Test Edge Functions

You can test edge functions using curl or the Supabase Dashboard:

```bash
# Test match-donors
curl -X POST https://tsdnizxxjpxqotycaxdb.supabase.co/functions/v1/match-donors \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"blood_group":"O+","latitude":31.5204,"longitude":74.3587,"city":"Lahore"}'
```

## Step 7: Troubleshooting

### Edge Function Deployment Fails

**Error**: "Service role key not found"
- **Solution**: Ensure you created the `.env` file in the `supabase` directory with the service role key

**Error**: "Function not found"
- **Solution**: Ensure you ran `supabase link` before deploying functions

### Frontend Cannot Connect to Supabase

**Error**: "Missing Supabase environment variable"
- **Solution**: Check that `.env` file exists in the project root with correct values

**Error**: "Invalid API key"
- **Solution**: Verify your anon key is correct in the `.env` file

### Auth Not Working

**Error**: "Profile not created after signup"
- **Solution**: Ensure `03-auth-setup.sql` was run successfully. Check the `handle_new_user` trigger exists

**Error**: "Role not set"
- **Solution**: The profile trigger should set the role from auth metadata. Check the trigger function

### Dashboard Shows No Data

**Error**: "No donations/requests shown"
- **Solution**: Run `04-sample-data.sql` to populate sample data, or create data through the UI

### Smart Matching Returns No Results

**Error**: "No compatible donors found"
- **Solution**: Ensure donors are registered with:
  - Valid blood group
  - Location data (latitude/longitude)
  - `is_available = true`
  - Last donation > 3 months ago

### Railway Deployment Issues

**Error**: "Build failed"
- **Solution**: Check Railway build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify build command is correct (`npm run build`)

**Error**: "Environment variables not found"
- **Solution**: Ensure all required environment variables are set in Railway project settings
- Variable names must match exactly (case-sensitive)

**Error**: "GitHub Actions deployment fails"
- **Solution**: Verify `RAILWAY_TOKEN` secret is correctly set in GitHub repository settings
- Check that the token has proper permissions
- Ensure the workflow file is in `.github/workflows/` directory

**Error**: "Application deployed but not accessible"
- **Solution**: Check Railway service logs for runtime errors
- Verify health check path is correct
- Ensure the port is properly configured

## Architecture Overview

### Database Schema

- **profiles**: User profiles with role, location, contact info
- **donors**: Donor-specific data (blood group, donations, badges)
- **blood_requests**: Blood requests with unique LL-XXXXX codes
- **donor_responses**: Donor responses to requests
- **hospitals**: Hospital information
- **blood_inventory**: Hospital blood inventory levels
- **donations**: Donation records
- **notifications**: User notifications

### Edge Functions

1. **match-donors**: Finds compatible donors by blood group and location
2. **create-sos-request**: Creates blood request with auto-generated code
3. **update-request-status**: Updates request status and handles rewards
4. **get-tracking-data**: Returns tracking info for a request
5. **get-dashboard-stats**: Returns role-specific dashboard statistics

### Frontend Pages

- **Home**: Landing page with features and stats
- **Auth**: Login/Register page
- **Smart Matching**: AI-powered donor matching
- **Donor Dashboard**: Donor stats, donations, achievements
- **Patient Dashboard**: Blood requests, tracking
- **Hospital Dashboard**: Inventory, pending requests

## Security Features

- Row Level Security (RLS) on all tables
- Service role key only used in edge functions
- Anon key used in frontend with RLS restrictions
- Users can only access their own data
- Hospitals can only manage their inventory

## Blood Group Compatibility

The system uses standard blood group compatibility:
- **O-**: Universal donor (can donate to all)
- **AB+**: Universal recipient (can receive from all)
- Other groups follow standard compatibility rules

## Badge System

Donors earn badges based on donation count:
- **None**: 0-4 donations
- **Bronze**: 5-9 donations
- **Silver**: 10-19 donations
- **Gold**: 20-49 donations
- **Lifesaver**: 50+ donations

## Support

For issues or questions:
1. Check the Supabase logs in the dashboard
2. Check browser console for frontend errors
3. Verify all SQL scripts were run in order
4. Ensure edge functions are deployed successfully

## Next Steps

After setup is complete:
1. Customize the UI as needed
2. Add more sample data for testing
3. Set up production environment
4. Configure custom domain
5. Add monitoring and analytics
