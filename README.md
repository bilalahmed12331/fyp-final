# LifeLink

A blood donation management system connecting donors, patients, and hospitals with smart matching capabilities.

## Project Structure

This project is separated into frontend and backend directories:

```
lifelink-source/
├── frontend/              # React frontend application
│   ├── src/              # Source code
│   ├── package.json      # Frontend dependencies
│   ├── railway.json      # Railway configuration
│   ├── nixpacks.toml     # Nixpacks build configuration
│   └── README.md         # Frontend documentation
├── backend/              # Supabase backend
│   ├── supabase/         # Edge functions and migrations
│   ├── *.sql             # Database schema scripts
│   ├── package.json      # Backend dependencies
│   └── README.md         # Backend documentation
├── .github/
│   └── workflows/        # GitHub Actions workflows
│       └── deploy-railway.yml
├── SETUP.md              # Complete setup guide
└── AGENTS.md             # Agent configuration
```

## Deployment

### Railway Deployment (Recommended)

This project is configured for automatic deployment to Railway via GitHub Actions.

#### Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Push your code to GitHub
3. **Railway Token**: Get your Railway token from Railway settings

#### Setup Steps

1. **Create Railway Project**:
   - Go to [railway.app](https://railway.app) and create a new project
   - Select "Deploy from GitHub repo"
   - Connect your GitHub repository

2. **Configure Environment Variables**:
   In Railway project settings, add these variables:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   ```

3. **Setup GitHub Actions**:
   - Go to your GitHub repository settings
   - Navigate to Secrets and variables → Actions
   - Add a new secret named `RAILWAY_TOKEN` with your Railway API token

4. **Automatic Deployment**:
   - Push to `main` or `master` branch
   - GitHub Actions will automatically deploy to Railway
   - Monitor deployment in the Actions tab

#### Manual Deployment

Alternatively, deploy manually using Railway CLI:
```bash
npm install -g @railway/cli
railway login
railway up
```

### Local Development

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Follow the setup instructions in [backend/README.md](backend/README.md) to:
   - Set up the Supabase database
   - Deploy edge functions

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at: http://localhost:5173

## Detailed Setup

For complete setup instructions, including database configuration, edge function deployment, and testing, see [SETUP.md](SETUP.md).

## Tech Stack

### Frontend
- React 19
- TanStack Start (full-stack React framework)
- TanStack Router
- TanStack Query
- TailwindCSS
- Radix UI
- Supabase JS Client

### Backend
- Supabase (PostgreSQL database)
- Supabase Edge Functions (serverless functions)
- Row Level Security (RLS)

## Features

- **Smart Donor Matching**: AI-powered blood donor matching based on location and blood group
- **Multi-Role Support**: Donors, Patients, Hospitals, and Admin dashboards
- **Real-time Updates**: Live tracking of blood requests and donor responses
- **Badge System**: Gamification for donors based on donation count
- **Secure Authentication**: Supabase Auth with role-based access control
- **Blood Inventory Management**: Hospital inventory tracking and alerts

## License

Private project
