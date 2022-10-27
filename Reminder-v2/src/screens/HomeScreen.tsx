import React, { lazy, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { customTheme } from "../constants/theme";
import i18n from "../services/i18n";
import { BackHandler } from "react-native";
import VehiclesListScreen from "./VehiclesListScreen";
import UnpaidListScreen from "./UnpaidListScreen";
import Header from "../components/Header";

const Tab = createMaterialTopTabNavigator();

const HomeScreen = () => {
  const navigations = useNavigation();
  useLayoutEffect(() => {
    navigations.setOptions({ headerShown: false });
    const _event = BackHandler.addEventListener(
      "hardwareBackPress",
      function () {
        return true;
      }
    );
    return _event.remove;
  }, []);

  return (
    <>
      <Header />
      <Tab.Navigator
        screenOptions={{
          tabBarBounces: true,
          tabBarIndicatorStyle: {
            height: 8,
            backgroundColor: customTheme.colors.primary,
          },
          tabBarIndicatorContainerStyle: {
            backgroundColor: customTheme.colors.headerBackground,
          },
          tabBarLabelStyle: {
            color: customTheme.colors.white,
          },
          animationEnabled: true,
          lazy: true,
        }}
      >
        <Tab.Screen
          name={i18n.t("vehicles_list")}
          component={VehiclesListScreen}
        />
        <Tab.Screen name={i18n.t("unpaid_list")} component={UnpaidListScreen} />
      </Tab.Navigator>
    </>
  );
};

export default HomeScreen;
