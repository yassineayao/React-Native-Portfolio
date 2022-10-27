import { View } from "react-native";
import React from "react";
import { customTheme } from "../constants/theme";

const CardContainer = (prop: {
  children: JSX.Element | JSX.Element[];
  _className?: string;
}) => {
  return (
    <View
      className={`py-6 px-3 my-2 mx-3 rounded-sm shadow shadow-gray-900 ${prop._className}`}
      style={{
        backgroundColor: customTheme.colors.white,
      }}
    >
      {prop.children}
    </View>
  );
};

export default CardContainer;
