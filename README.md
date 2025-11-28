# Daily Reflection App

A simple, private space to capture your daily thoughts, feelings, and energy levels. This app is designed to help you build a habit of reflection with a calm, distraction-free interface.

## Features

- **Daily Journaling**: Guided prompts for what went well, what you learned, and where you got stuck.
- **Mood & Energy Tracking**: Log your emotional state and energy levels each day.
- **Privacy Controls**: Choose to keep entries private, share them with friends, or post them to the public community feed.
- **Friends System**: Connect with others to see their friends-only reflections.
- **History View**: A timeline of your past entries to see how you've grown over time.
- **Notion-Style UI**: A clean, minimal interface that focuses on your content.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Language**: TypeScript

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/daily-reflection.git
   cd daily-reflection
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

This project uses Supabase. You will need to run the SQL scripts found in the `supabase/` folder to set up your tables and security policies.

1. `supabase/reset_database.sql` - Creates all necessary tables (profiles, reflections, friends) and sets up Row Level Security (RLS).
2. `supabase/add_username.sql` - Adds username support to profiles.

## License

This project is open source and available under the [MIT License](LICENSE).
