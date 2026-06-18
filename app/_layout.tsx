import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@store/authStore';

export default function RootLayout() {
  const { getCurrentSession, isLoading } = useAuthStore();

  useEffect(() => {
    getCurrentSession();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}
