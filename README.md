# Betze Matchday 🏟️

**Expo (React Native) Fan- & Stadion-App für 1. FC Kaiserslautern**

---

## 🎯 Features

✅ **Authentifizierung** - Registration, Login, Session Management mit Supabase Auth  
✅ **User Profile & Gamification** - Username, Points, Levels, Avatars  
✅ **Social Feed** - Posts, Comments, Likes mit Realtime Updates  
✅ **GPS Checkins** - Stadium Detection & Location Tracking  
✅ **Leaderboard** - Points System, Rankings, Achievements  
✅ **Push Notifications** - Match Events, Achievements, Social Updates  
✅ **Fan Map** - Live User Locations (Optional)  
✅ **Matchday Dashboard** - Upcoming Matches, Stats, Live Events  

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Expo Router, React Native, TypeScript |
| **State Management** | Zustand |
| **Backend** | Supabase (Auth, Database, Realtime, RLS) |
| **Location** | Expo Location |
| **Notifications** | Expo Notifications |
| **Maps** | React Native Maps (optional) |

---

## 📁 Project Structure

```
betze-matchday/
├── app/                          # Expo Router screens (file-based routing)
│   ├── (auth)/                   # Auth flow
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── reset-password.tsx
│   ├── (app)/                    # Main app (protected)
│   │   └── (tabs)/              # Tab navigation
│   │       ├── home.tsx
│   │       ├── feed.tsx
│   │       ├── checkin.tsx
│   │       ├── leaderboard.tsx
│   │       └── profile.tsx
│   └── _layout.tsx              # Root layout
│
├── src/
│   ├── services/                 # Supabase & API services
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   ├── posts.ts
│   │   ├── checkins.ts
│   │   ├── gamification.ts
│   │   └── notifications.ts
│   │
│   ├── store/                    # Zustand state management
│   │   ├── authStore.ts
│   │   ├── feedStore.ts
│   │   └── gamificationStore.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useLocation.ts
│   │   └── useRealtimePosts.ts
│   │
│   ├── types/                    # TypeScript definitions
│   │   └── index.ts
│   │
│   ├── utils/                    # Utilities & helpers
│   │   └── validation.ts
│   │
│   └── components/               # Reusable UI components (future)
│
├── supabase/
│   ├── migrations/               # SQL migrations
│   │   ├── 001_init_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_triggers.sql
│   │
│   └── edge_functions/           # Serverless functions
│       └── create_user_profile/
│
├── .env.example                  # Environment template
├── app.json                      # Expo config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js ≥ 18
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Supabase project (https://supabase.com)

### 2. Clone & Install

```bash
git clone https://github.com/rahnsaschalu-stack/betze-matchday.git
cd betze-matchday
npm install
```

### 3. Setup Environment

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Location (1. FC Kaiserslautern)
EXPO_PUBLIC_STADIUM_LAT=49.4461
EXPO_PUBLIC_STADIUM_LNG=7.7640
EXPO_PUBLIC_STADIUM_RADIUS=500

# Optional
EXPO_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

### 4. Supabase Database Setup

1. Go to Supabase Dashboard
2. Create new project
3. Run SQL migrations in order:
   - `supabase/migrations/001_init_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_triggers.sql`

```bash
# Or use Supabase CLI
supabase db push
```

### 5. Run Dev Server

```bash
npm start
```

Then:
- **iOS**: Press `i`
- **Android**: Press `a`
- **Web**: Press `w`

---

## 📱 Screens & Features

### 🔐 Auth Screens

- **Login** - Email & password authentication
- **Register** - New user registration with validation
- **Reset Password** - Email-based password recovery

### 🏠 Main App (Tabs)

#### Home Dashboard
- User rank & stats
- Points & level display
- Quick stadium checkin button
- Last checkin info

#### Social Feed
- View posts from other fans
- Create new posts
- Like & comment on posts
- Realtime updates

#### Stadium Checkin
- GPS location tracking
- Distance to stadium calculation
- Status badge (At Stadium / Near / Away)
- Checkin history
- Points earned

#### Leaderboard
- Global top 50 players
- Your rank & stats
- Points & level ranking
- Achievements

#### Profile
- User stats (rank, points, level)
- Achievements display
- Logout option

---

## 🎮 Gamification System

### Points & Levels

| Action | Points |
|--------|--------|
| Stadium Checkin | 10 pts |
| Post Created | 5 pts |
| Post Liked | 1 pt |
| Achievement Unlocked | 50 pts |

**Level Calculation**: Level = Points / 100 + 1

### Achievements

- 🎯 First Checkin
- 🏆 Top 10 Leaderboard
- 📱 First Post
- ❤️ 100 Likes
- 🔥 7-Day Streak

---

## 🔒 Security & RLS

All tables have Row Level Security (RLS) enabled:

- Users can only read/modify their own data
- Posts are publicly readable
- Likes/comments are user-specific
- Location data is user-private

---

## 📦 Database Schema

### Core Tables

- `user_profiles` - User profiles & stats
- `posts` - Social feed posts
- `post_likes` - Post likes
- `post_comments` - Post comments
- `checkins` - Location checkins
- `achievements` - User achievements
- `matches` - Match info
- `notifications` - User notifications
- `push_tokens` - Device tokens

---

## 🔄 Realtime Features

Subscribe to live updates:

```typescript
// Posts update in real-time
supabase
  .from('posts')
  .on('*', (payload) => {
    console.log('New post:', payload);
  })
  .subscribe();
```

---

## 📊 Development

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

---

## 🚢 Deployment

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure project
eas init

# Build
eas build --platform ios
eas build --platform android

# Submit to stores
eas submit
```

### Manual APK/IPA Build

```bash
npm run build
```

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/awesome-feature`
3. Commit: `git commit -m 'feat: Add awesome feature'`
4. Push: `git push origin feature/awesome-feature`
5. Open Pull Request

### Code Style

- TypeScript strict mode
- ESLint config: universe
- Prettier formatting

---

## 📝 License

MIT License - see LICENSE file

---

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Supabase Docs](https://supabase.com/docs)
- [React Native](https://reactnative.dev)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 📞 Support

For issues or questions:
- Open GitHub Issue
- Check existing discussions
- Email: rahn.sascha.lu@gmail.com

---

**Built with ❤️ for 1. FC Kaiserslautern fans** 🔴⚪
