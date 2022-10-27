import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { PhoneIcon } from "react-native-heroicons/outline";
import i18n from "../services/i18n";
import { Vehicle } from "../types";
import CardContainer from "./CardContainer";
import { locale } from "../constants/settings";

const ListItemCard = (prop: { vehicle: Vehicle; callBack?: Function }) => {
  const navigations = useNavigation();
  return (
    <CardContainer>
      <TouchableOpacity
        onPress={() => {
          if (prop.callBack) {
            prop.callBack();
          }
          navigations.navigate(
            "DetailsScreen" as never,
            {
              id: prop.vehicle.id,
            } as never
          );
        }}
        className={`${
          i18n.locale === "ar" ? "flex-row-reverse" : "flex-row"
        } items-center`}
      >
        <View className="flex-1">
          <Text>
            {i18n.t("name")}: {prop.vehicle.client.name}
          </Text>
          <Text>
            {i18n.t("date")}:{" "}
            {prop.vehicle.deadline?.toLocaleDateString(locale)}
          </Text>
          {prop.vehicle.payment.price ? (
            <Text>
              {i18n.t("remain")}:{" "}
              {`${prop.vehicle.payment.price} ${i18n.t("dh")}`}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity className="relative py-3 pr-3">
          <Text className="absolute right-1 top-2 px-2 bg-blue-500 rounded-full text-white text-center">
            {prop.vehicle.count}
          </Text>
          <View>
            <PhoneIcon size={30} color="green" />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </CardContainer>
  );
};

export default ListItemCard;
