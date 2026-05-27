import { Stack } from 'expo-router';
import { useTheme } from '../../../src/theme';

export default function SettingsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animationEnabled: true,
        animationTypeForReplace: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="account" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="security" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="products" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}
