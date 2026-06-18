# Betze Matchday - Contributing Guide

## Development Setup

### Prerequisites
- Node.js ≥ 18
- npm/yarn
- Git
- Supabase account

### First Time Setup

```bash
# Clone repository
git clone https://github.com/rahnsaschalu-stack/betze-matchday.git
cd betze-matchday

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit with your Supabase credentials
nano .env.local  # or your favorite editor
```

## Development Workflow

### Start Dev Server

```bash
npm start
```

### Running on Devices

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

## Code Style & Standards

### TypeScript
- Strict mode enabled
- All files use `.ts` or `.tsx` extensions
- Type all function parameters and returns

### Naming Conventions

```typescript
// Components: PascalCase
const UserProfile = () => {}

// Functions: camelCase
const getUserData = () => {}

// Constants: UPPER_SNAKE_CASE
const STADIUM_RADIUS = 500

// Files: kebab-case
// src/services/auth.ts
// app/(auth)/login.tsx
```

### Formatting

```bash
# Run linter
npm run lint

# Type check
npm run type-check
```

## Project Structure

### App Routes

```
app/
├── (auth)/          # Auth flow - accessible without login
├── (app)/           # Main app - requires authentication
└── _layout.tsx      # Root navigator
```

### Services

Create new services in `src/services/`:

```typescript
// src/services/example.ts
import supabase from './supabase';

export async function getExampleData() {
  const { data, error } = await supabase
    .from('example_table')
    .select('*')
    .limit(10);

  return { data, error };
}
```

### State Management (Zustand)

Create stores in `src/store/`:

```typescript
// src/store/exampleStore.ts
import { create } from 'zustand';

interface ExampleState {
  data: any[];
  isLoading: boolean;
  fetchData: () => Promise<void>;
}

export const useExampleStore = create<ExampleState>((set) => ({
  data: [],
  isLoading: false,
  fetchData: async () => {
    set({ isLoading: true });
    // Fetch logic
    set({ data: result, isLoading: false });
  },
}));
```

### Custom Hooks

Create hooks in `src/hooks/`:

```typescript
// src/hooks/useExample.ts
import { useState, useEffect } from 'react';

export function useExample() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Hook logic
  }, []);

  return { state };
}
```

## Git Workflow

### Branch Naming

```bash
# Feature
git checkout -b feature/user-authentication

# Fix
git checkout -b fix/login-error

# Refactor
git checkout -b refactor/feed-component
```

### Commit Messages

Use conventional commits:

```bash
# Format: type(scope): description
git commit -m "feat(auth): Add email verification"
git commit -m "fix(feed): Remove duplicate posts"
git commit -m "docs(readme): Update setup instructions"
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `docs` - Documentation
- `style` - Formatting
- `test` - Tests

### Pull Requests

1. Create feature branch
2. Make changes
3. Push to fork
4. Open PR with description
5. Wait for review
6. Address feedback
7. Merge when approved

## Database Migrations

### Creating New Tables

1. Create migration in `supabase/migrations/`
2. Name: `NNN_description.sql` (e.g., `004_add_comments_table.sql`)
3. Include:
   - CREATE TABLE
   - Indexes
   - RLS Policies

```sql
-- supabase/migrations/004_add_comments_table.sql

CREATE TABLE IF NOT EXISTS public.comments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    post_id uuid NOT NULL REFERENCES public.posts(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments readable by all"
    ON public.comments
    FOR SELECT
    USING (true);
```

4. Run: `supabase db push`

## Testing

### Manual Testing Checklist

- [ ] Login flow works
- [ ] Registration validates input
- [ ] Can create posts
- [ ] Likes/comments work
- [ ] Leaderboard updates
- [ ] Checkin records location
- [ ] Push notifications trigger

## Debugging

### React DevTools

```bash
# Install React DevTools
npm install --save-dev @react-navigation/devtools
```

### Supabase Console

1. Go to Supabase Dashboard
2. Check realtime activity
3. View RLS violations in logs
4. Test queries in SQL editor

### Console Logging

```typescript
// Use for debugging
console.log('User data:', userData);
console.error('Error:', error);
console.warn('Warning:', warning);
```

## Performance Tips

1. **Memoize Components**: Use `React.memo` for expensive renders
2. **Lazy Load**: Use code splitting for large screens
3. **Debounce**: Debounce location updates
4. **Query Optimization**: Limit SELECT fields, add indexes
5. **Caching**: Cache frequently accessed data

## Common Issues

### "Cannot find module '@'"

Check `tsconfig.json` paths are correct.

### Supabase Connection Error

Verify `.env.local` has correct credentials.

### Location Permission Denied

Grant location permission in app settings on device.

## Resources

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Questions?

Open an issue on GitHub or contact the maintainers.
