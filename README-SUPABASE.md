# Supabase Backend Setup Guide

This guide will help you set up the Supabase backend for your Pipefitter Exam Prep application.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up/login to your account
4. Create a new project:
   - Choose a name (e.g., "pipefitter-exam-prep")
   - Choose a database password
   - Select a region closest to your users
   - Click "Create new project"

## 2. Get Project Credentials

Once your project is created:

1. Go to Project Settings → API
2. Copy the **Project URL** 
3. Copy the **anon public** key

## 3. Set Up Environment Variables

Create a `.env` file in your project root:

```bash
# Copy from .env.example and fill in your values
cp .env.example .env
```

Update `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Set Up Database Schema

1. Go to the Supabase Dashboard
2. Click on "SQL Editor" in the sidebar
3. Click "New query"
4. Copy the contents of `supabase/schema.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute the schema

This will create:
- `profiles` table (user profiles)
- `questions` table (exam questions)
- `user_progress` table (progress tracking)
- `quiz_attempts` table (quiz history)
- `study_guides` table (study materials)
- Row Level Security (RLS) policies
- Database functions and triggers

## 5. Migrate Existing Data

1. Update the Supabase credentials in `scripts/migrate-data.js`
2. Run the migration script:

```bash
npm run migrate
```

Or run it directly:

```bash
node scripts/migrate-data.js
```

This will populate your database with:
- All existing questions from `public/data/questions.json`
- All study guides from `public/data/study-guides.json`

## 6. Configure Authentication

1. In Supabase Dashboard, go to Authentication → Settings
2. Configure your email settings (optional but recommended)
3. Set up your site URL in "Site URL" field
4. Configure redirect URLs for your domain

## 7. Test the Integration

1. Start your development server:

```bash
npm run dev
```

2. The app should now:
   - Redirect unauthenticated users to the login page
   - Allow user registration and login
   - Store user progress in Supabase
   - Load questions from Supabase instead of local files

## 8. Deploy to Production

When deploying to production:

1. Add your Supabase environment variables to your hosting platform
2. Update the Site URL in Supabase Authentication settings
3. Ensure your production domain is added to the redirect URLs

## Features Enabled by Supabase

- **User Authentication**: Email/password signup and login
- **Real-time Data**: Live progress updates
- **Data Persistence**: User progress saved across devices
- **Row Level Security**: Users can only access their own data
- **Scalability**: Handles multiple users simultaneously
- **API**: RESTful API with automatic type generation

## Troubleshooting

### Common Issues

1. **"User not authenticated" error**
   - Check that your environment variables are set correctly
   - Ensure the user is logged in

2. **CORS errors**
   - Add your development URL to Supabase CORS settings
   - Check that your Site URL is configured correctly

3. **Database connection errors**
   - Verify your Supabase URL and anon key
   - Check that the database schema was applied correctly

4. **Migration fails**
   - Ensure your Supabase credentials in the migration script are correct
   - Check that the database tables exist before running migration

### Getting Help

- Check the browser console for detailed error messages
- Review the Supabase dashboard logs
- Ensure all environment variables are properly set
- Verify the database schema was applied successfully

## Next Steps

Once Supabase is set up, you can:

1. Add more authentication providers (Google, GitHub, etc.)
2. Implement real-time features like live leaderboards
3. Add admin functionality for managing questions
4. Set up analytics and user insights
5. Implement email notifications for study reminders
