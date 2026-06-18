# Betze Matchday 🏟️

Expo (React Native) Fan- & Stadion-App für 1. FC Kaiserslautern

## Features

✅ **Auth System** - Registration, Login, Session Management  
✅ **User Profiles** - Username, Points, Levels, Avatars  
✅ **Social Feed** - Posts, Comments, Likes with Realtime Updates  
✅ **GPS Checkins** - Stadium Detection & Location Tracking  
✅ **Gamification** - Points System, Levels, Achievements, Leaderboard  
✅ **Push Notifications** - Match Events, Achievements, Social Updates  
✅ **Fan Map** - Live User Locations (Optional)  
✅ **Matchday Dashboard** - Upcoming Matches, Stats, Events  

## Tech Stack

- **Frontend**: Expo Router, React Native, TypeScript
- **State**: Zustand
- **Backend**: Supabase (Auth, Database, Realtime, RLS)
- **Location**: Expo Location
- **Notifications**: Expo Notifications
- **Maps**: React Native Maps (optional)

## Project Structure

```
app/                 # Expo Router screens
src/
  ├── services/      # Supabase & API services
  ├── store/         # Zustand state management
  ├── hooks/         # Custom React hooks
  ├── utils/         # Utilities & helpers
  ├── types/         # TypeScript types
  └── components/    # Reusable UI components
supabase/            # SQL migrations & edge functions
```

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/rahnsaschalu-stack/betze-matchday.git
cd betze-matchday
npm install
```

### 2. Environment Variables

Create `.env.local`:

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
EXPO_PUBLIC_STADIUM_LAT=49.4461
EXPO_PUBLIC_STADIUM_LNG=7.7640
EXPO_PUBLIC_STADIUM_RADIUS=500
```

### 3. Supabase Setup

Run migrations in `supabase/migrations/` to set up database schema.

### 4. Run Dev Server

```bash
npm start
```

## Development

- **Type Check**: `npm run type-check`
- **Lint**: `npm run lint`
- **Build**: `npm run build`

## Contributing

Fork → Feature Branch → PR

Follow TypeScript & production-ready code standards.

## License

MIT
