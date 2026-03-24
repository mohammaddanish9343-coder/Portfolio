# Portfolio Project

A modern portfolio website with contact form functionality using Supabase as the backend.

## Features

- Responsive portfolio website
- Contact form with database storage
- Admin panel to view/manage messages
- Deployable to GitHub Pages (frontend) + Vercel (backend)

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5000` in your browser

## Deployment

### Backend (API) - Deploy to Vercel

1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Deploy the backend:
   ```bash
   vercel --prod
   ```
4. Set environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
   - `SUPABASE_USERS_TABLE`

5. Note your Vercel deployment URL (e.g., `https://your-project.vercel.app`)

### Frontend - Deploy to GitHub Pages

1. Enable GitHub Pages in your repository settings
2. Go to Settings → Pages → Source: "GitHub Actions"
3. Update the backend URL in `script.js` and `messages.html`:
   - Replace `'https://your-backend-url.vercel.app/api'` with your actual Vercel URL
4. Push your changes to the `main` branch
5. GitHub Actions will automatically build and deploy the frontend

## API Endpoints

- `GET /api/users` - Get all messages
- `POST /api/users` - Create new message
- `GET /api/users/:id` - Get specific message
- `PUT /api/users/:id` - Update message
- `DELETE /api/users/:id` - Delete message
- `GET /api/health` - Health check

## Environment Variables

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin operations)
- `SUPABASE_USERS_TABLE` - Table name for messages (default: 'users')
- `PORT` - Server port (default: 5000)

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: Supabase (PostgreSQL)
- Deployment: GitHub Pages (frontend), Vercel (backend)