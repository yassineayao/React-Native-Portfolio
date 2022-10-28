import { View } from "react-native";
import React from "react";

const CardContainer = (prop: {
  children: JSX.Element | JSX.Element[];
  _className?: string;
}) => {
  return (
    <View
      className={`py-6 px-3 my-2 mx-3 rounded-sm shadow shadow-gray-900 bg-white ${prop._className}`}
    >
      {prop.children}
    </View>
  );
};

export default CardContainer;
