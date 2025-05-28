# FormIQ - Electrical Switchboard Quoting & Engineering Automation

FormIQ is a modern web application for electrical switchboard quoting and engineering automation, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **User Authentication**: Secure signup/login with Supabase Auth
- **Company Management**: Multi-tenant architecture with company-based access
- **Approval Workflow**: Admin approval system for new users
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with SSR
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd formiq
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set Up Database

Run the SQL migration in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase/migrations/001_initial_schema.sql
```

This will create:
- `companies` table with company_name and domain
- `users` table linked to Supabase auth with approval workflow
- Row Level Security policies
- Triggers for automatic user creation

### 4. Seed Initial Data (Optional)

Add some test companies to your database:

```sql
INSERT INTO companies (company_name, domain) VALUES 
('Atlas Switch', 'atlasswitch.com'),
('Demo Company', 'demo.com');
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Application Flow

### Authentication Flow

1. **Sign Up**: Users create accounts with company association
2. **Pending Approval**: New users see a pending approval page
3. **Admin Approval**: Admins can approve users in the database
4. **Access Granted**: Approved users can access `/formiq`

### Database Structure

#### Companies Table
- `id` (UUID, Primary Key)
- `company_name` (Text, Unique)
- `domain` (Text, Unique)
- `created_at`, `updated_at` (Timestamps)

#### Users Table
- `id` (UUID, References auth.users)
- `first_name`, `last_name` (Text)
- `email` (Text, Unique)
- `company_id` (UUID, References companies)
- `is_approved` (Boolean, Default: false)
- `created_at`, `updated_at` (Timestamps)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Login page
│   ├── signup/
│   │   └── page.tsx          # Sign up page
│   ├── pending-approval/
│   │   └── page.tsx          # Pending approval page
│   ├── formiq/
│   │   └── page.tsx          # Main application dashboard
│   ├── auth/
│   │   └── signout/
│   │       └── route.ts      # Sign out API route
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
lib/
├── supabase.ts               # Browser Supabase client
├── supabase-server.ts        # Server Supabase client
└── auth.ts                   # Authentication utilities
supabase/
└── migrations/
    └── 001_initial_schema.sql # Database schema
middleware.ts                 # Route protection middleware
```

## Key Features

### User Management
- Secure authentication with Supabase SSR
- Company-based user organization
- Admin approval workflow
- Row-level security

### UI/UX
- Responsive design for all screen sizes
- Consistent FormIQ branding
- Accessible form design
- Loading states and error handling

### Security
- Row Level Security (RLS) enabled
- Protected routes with middleware
- Secure password handling via Supabase Auth
- Company-based data isolation
- SSR-compatible authentication

## Development

### Supabase SSR Integration

This project uses the latest `@supabase/ssr` package for proper server-side rendering support:

- **Browser Client**: Used in client components (`lib/supabase.ts`)
- **Server Client**: Used in server components and API routes (`lib/supabase-server.ts`)
- **Middleware**: Handles route protection and session management

### Adding New Features

1. Create new pages in `src/app/`
2. Add database tables/functions in new migration files
3. Update TypeScript types in `lib/supabase.ts`
4. Add authentication checks as needed

### Database Migrations

Create new migration files in `supabase/migrations/` following the naming convention:
`002_feature_name.sql`

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

Required for production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (your production URL)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for Atlas Switch.

## Support

For support, contact the development team or create an issue in the repository.
