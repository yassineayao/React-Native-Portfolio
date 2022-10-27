import { View } from "react-native";
import React from "react";
import i18n from "../services/i18n";

const SettingsCard = (prop: { children?: JSX.Element | JSX.Element[] }) => {
  return (
    <View
      className={`bg-white p-4 mt-4 mx-3 shadow shadow-black ${
        i18n.locale == "ar" ? "flex-row-reverse" : "flex-row"
      } justify-between items-center`}
    >
      {prop.children}
    </View>
  );
};

export default SettingsCard;
