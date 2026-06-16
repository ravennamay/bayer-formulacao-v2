import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '../src/auth';
import { ThemeProvider, useTheme } from '../src/theme';

const AUTH_ROUTES = new Set(['login', 'select-department', 'forgot-password']);

function AuthGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const currentSegment = segments[0] as string | undefined;
    const inTabs = currentSegment === '(tabs)';
    const inAuth = AUTH_ROUTES.has(currentSegment ?? '');

    if (!user) {
      if (!inAuth) {
        router.replace('/login');
      }
      return;
    }

    if (!user.department) {
      if (currentSegment !== 'select-department') {
        router.replace('/select-department');
      }
      return;
    }

    if (!inTabs) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  return null;
}

function AppNavigator() {
  const { user, loading } = useAuth();
  const { mode, colors } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <AuthGuard />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
