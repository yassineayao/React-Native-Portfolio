/**
 * File: Themes.js
 * Description: contains the app theme configurations
 */
import { Dimensions } from "react-native";
export const { width, height } = Dimensions.get("window");

export const COLORS = {
  // base colors
  primary: "#e65100",
  lightPrimary: "rgba(230, 81, 0, .7)",
  secondary: "#bdbdbd",
  success: "#2a9d8f",
  lightSuccess: "rgba(42, 157, 143, .3)",
  danger: "#ef5350",

  // colors
  black: "#1e1f20",
  white: "#ffffff",
  // lightGreen: "#5BFF62",
  lightGreen: "#52c2a6",
  green: "#41B619",
  darkGreen: "#117243",

  lightGray: "#eeeff4",
  lightGray2: "#949494",
  lightGray4: "#6f6f77",
  transparent: "transparent",
  darkgray: "#898c95",

  category: "#ffe1c5",
  favorite: "#e5c1e5",
  history: "#d7d8f8",
  cart: "#d7d8f8",
  mBox: "#5e03c2",
  m6Box: "#122e51",
  yBox: "#0e0050",
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 45,
  radius1: 7,
  padding: 8,
  padding2: 12,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: {
    fontFamily: "Roboto-regular",
    fontSize: SIZES.largeTitle,
    lineHeight: 36,
  },
  h1: { fontFamily: "Roboto-black", fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: "Roboto-bold", fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: "Roboto-bold", fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: "Roboto-bold", fontSize: SIZES.h4, lineHeight: 22 },
  body1: {
    fontFamily: "Roboto-regular",
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {
    fontFamily: "Roboto-regular",
    fontSize: SIZES.body2,
    lineHeight: 30,
  },
  body3: {
    fontFamily: "Roboto-regular",
    fontSize: SIZES.body3,
    lineHeight: 22,
  },
  body4: {
    fontFamily: "Roboto-regular",
    fontSize: SIZES.body4,
    lineHeight: 22,
  },
  body5: {
    fontFamily: "Roboto-regular",
    fontSize: SIZES.body5,
    lineHeight: 22,
  },
};

export const EFFECTS = {
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 1,
  },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
