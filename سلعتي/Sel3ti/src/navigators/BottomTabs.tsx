/**
 * File: Home.js
 * Description: Render the bottom tab and its corresponding screens
 */
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

import History from "../screens/History";
import Category from "../screens/Category";
import Cart from "../screens/Cart";
import Favorites from "../screens/Favorites";

import Statistics from "../screens/Statistics";
import i18n from "../locales/i18n";
import { COLORS } from "../constants/Theme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// create the tab navigator
const Tab = createBottomTabNavigator();

function BottomTabs() {
  /**
   * render the tab navigator
   */
  return (
    <Tab.Navigator
      initialRouteName={i18n.t("home_statistics_screen_name")}
      backBehavior="order"
      safeAreaInsets={{
        bottom: 3,
        top: 3,
        left: 2,
        right: 2,
      }}
      detachInactiveScreens
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarLabelStyle: {
          fontSize: 14,
          textTransform: "capitalize",
        },
        lazy: true,
      }}
      sceneContainerStyle={{
        padding: 1,
      }}
    >
      <Tab.Screen
        name={i18n.t("home_statistics_screen_name")}
        component={Statistics}
        options={{
          tabBarIcon: (props: { color: string; focused: boolean }) => (
            <Icon
              name="chart-line"
              size={props.focused ? 24 : 22}
              color={props.color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={i18n.t("home_category_screen_name")}
        component={Category}
        options={{
          tabBarIcon: (props: { color: string; focused: boolean }) => (
            <Icon
              name="home"
              size={props.focused ? 24 : 22}
              color={props.color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={i18n.t("home_favorite_screen_name")}
        component={Favorites}
        options={{
          tabBarIcon: (props: { color: string; focused: boolean }) => (
            <Icon
              name="heart"
              size={props.focused ? 24 : 22}
              color={props.color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={i18n.t("home_cart_screen_name")}
        component={Cart}
        options={{
          tabBarIcon: (props: { color: string; focused: boolean }) => (
            <Icon
              name="shopping-cart"
              size={props.focused ? 24 : 22}
              color={props.color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={i18n.t("home_history_screen_name")}
        component={History}
        options={{
          tabBarIcon: (props: { color: string; focused: boolean }) => (
            <Icon
              name="archive"
              size={props.focused ? 24 : 22}
              color={props.color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabs;
