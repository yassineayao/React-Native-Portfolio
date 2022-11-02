import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import SplashScreen from "./src/screens/SplashScreen";
import { customTheme } from "./src/constants/theme";
import { StatusBar, View } from "react-native";
import SettingsScreen from "./src/screens/SettingsScreen";
import DetailsScreen from "./src/screens/DetailsScreen";
import i18n from "./src/services/i18n";

import { Database } from "./src/database/Database";
import { sharedValues } from "./src/contexts/SharedValues";
import { useEffect, useState } from "react";

import "./src/services/BackgroundJob";

// Initialize the database instance.
const Stack = createNativeStackNavigator();
const ContextProvider = sharedValues.Provider;

export default function App() {
  const [lang, setLang] = useState(0);
  useEffect(() => {
    i18n.locale = lang === 0 ? "ar" : "fr";
  }, [lang]);

  return (
    <View className="flex-1">
      <StatusBar
        animated
        barStyle="default"
        backgroundColor={customTheme.colors.statusbar}
      />
      <ContextProvider value={{ db: Database.getInstance(), lang, setLang }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTintColor: customTheme.colors.primary,
              headerStyle: {
                backgroundColor: customTheme.colors.headerBackground,
              },
              gestureEnabled: true,
              gestureDirection: "horizontal",
            }}
          >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen
              name="SettingsScreen"
              component={SettingsScreen}
              options={{
                title: i18n.t("settings"),
              }}
            />
            <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ContextProvider>
    </View>
  );
}
