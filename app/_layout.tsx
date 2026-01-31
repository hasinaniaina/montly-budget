import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Suspense, useEffect } from "react";
import { SQLiteProvider } from "expo-sqlite";
import { init } from "@/constants/db";
import FallBack from "@/components/fallBack";
import 'react-native-random-uuid'

const color = "#717171";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "k2d-bold": require("@/assets/fonts/K2D-Bold.ttf"),
    "k2d-light": require("@/assets/fonts/K2D-Light.ttf"),
    "k2d-regular": require("@/assets/fonts/K2D-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <Suspense fallback={<FallBack />}>
      <SQLiteProvider databaseName="monthlyBudget" onInit={init} useSuspense>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="forgotPassword" />
          <Stack.Screen name="dashboard" />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}
