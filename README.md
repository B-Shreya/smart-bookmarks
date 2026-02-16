# Smart Bookmark Manager  

A full-stack bookmark management web app that allows users to securely save, view, and manage personal bookmarks with Google authentication and real-time database syncing.

---

## Live Features

- Google OAuth login using Supabase Auth
- Add and delete personal bookmarks
- User-specific data protection using Row Level Security (RLS)
- Real-time updates across multiple tabs/devices
- Serverless backend using Supabase

---

##  Tech Stack

**Frontend**
- Next.js (App Router)
- React
- Tailwind CSS

**Backend / Database**
- Supabase Postgres
- Supabase Auth (Google OAuth)
- Supabase Realtime subscriptions
- Row Level Security (RLS)

---

##  Project Structure
app/
├── page.tsx # Login page
├── dashboard/
│ └── page.tsx # Bookmark dashboard
lib/
└── supabaseClient.ts # Supabase connection
.env.local # Environment variables


---

##  Authentication Flow

1. User signs in using Google OAuth
2. Supabase creates a secure session
3. Session token used for database queries
4. Row Level Security ensures users can only access their own bookmarks

---

##  Database Schema

**Table: bookmarks**

| Column      | Type      | Description |
|------------|-----------|-------------|
| id         | UUID      | Primary key |
| user_id    | UUID      | References authenticated user |
| title      | TEXT      | Bookmark title |
| url        | TEXT      | Bookmark link |
| created_at | TIMESTAMP | Auto-generated |

---

##  Security (RLS Policies)

- Users can view only their own bookmarks
- Users can insert only their own bookmarks
- Users can delete only their own bookmarks

---

## Real-Time Sync
The dashboard subscribes to Supabase realtime changes:

- INSERT → auto appears in UI
- DELETE → removed instantly
- Works across multiple tabs/devices

---


##  How to Run Locally

### 1. Clone repo
git clone <repo-link>
cd smart-bookmarks

### 2. Install dependencies
npm install

### 3. Add environment variables
Create `.env.local`
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

### 4. Start dev server
Run - npm run dev
Open:http://localhost:3000

---

##  Challenges Faced

- Configuring Google OAuth redirect URLs correctly
- Ensuring realtime updates triggered correctly
- Handling session loading before fetching bookmarks

