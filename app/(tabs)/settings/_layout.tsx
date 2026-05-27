import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme';

export default function SettingsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="account" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="appearance-themes" />
      <Stack.Screen name="products" />
      <Stack.Screen name="products-detail" />
      <Stack.Screen name="production" />
      <Stack.Screen name="security" />
      <Stack.Screen name="security-password" />
      <Stack.Screen name="security-2fa" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="system" />
      <Stack.Screen name="help" />
    </Stack>
  );
}
