import { View } from "react-native";
import React, { useContext, useEffect } from "react";
import i18n from "../services/i18n";
import { sharedValues } from "../contexts/SharedValues";

const SettingsCard = (prop: { children?: JSX.Element | JSX.Element[] }) => {
  const context = useContext(sharedValues);
  useEffect(() => {
    i18n.locale = context.lang === 0 ? "ar" : "fr";
  }, [context.lang]);
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
