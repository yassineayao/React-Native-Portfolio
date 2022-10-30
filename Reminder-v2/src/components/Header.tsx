import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  CogIcon as SettingIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { customTheme } from "../constants/theme";
import i18n from "../services/i18n";
import { Vehicle } from "../types";
import VehiclesList from "./VehiclesList";
import {
  CustomModal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "./CustomModal";
import SwitchSelector from "react-native-switch-selector";
import { sharedValues } from "../contexts/SharedValues";

const options = [
  { label: "ﻉ", value: "ar", accessibilityLabel: "ar" },
  { label: "fr", value: "fr", accessibilityLabel: "fr" },
];

const Header = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const context = useContext(sharedValues);
  const navigations = useNavigation();

  useEffect(() => {
    if (search.length) context.db.getVehiclesByClientName(search, setVehicles);
    else setVehicles([]);
  }, [search]);

  useEffect(() => {
    setVehicles([]);
    setSearch("");
  }, [modalVisible]);

  return (
    <View
      className={`${
        i18n.locale === "ar" ? "flex-row-reverse" : "flex-row"
      } justify-between items-center px-2 bg-headerBackground`}
    >
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className={`space-x-2 p-3 text-white ${
          i18n.locale === "ar" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <MagnifyingGlassIcon color={customTheme.colors.primary} />
      </TouchableOpacity>
      <View
        className={`${
          i18n.locale === "ar" ? "flex-row" : "flex-row-reverse"
        } space-2 py-2 items-center`}
      >
        <TouchableOpacity
          onPress={() => {
            navigations.navigate("SettingsScreen" as never);
          }}
        >
          <SettingIcon color={customTheme.colors.primary} size={30} />
        </TouchableOpacity>
        <SwitchSelector
          options={options}
          value={context.lang}
          initial={context.lang}
          onPress={(value) => {
            context.setLang(value === "ar" ? 0 : 1);
            i18n.locale = value;
          }}
          hasPadding
          bold
          buttonColor={customTheme.colors.primary}
          style={{
            width: 60,
            transform: [{ rotate: "90deg" }],
          }}
          textStyle={{
            transform: [{ rotate: "-90deg" }],
            color: customTheme.colors.primary,
          }}
          selectedTextStyle={{
            transform: [{ rotate: "-90deg" }],
            color: customTheme.colors.headerBackground,
          }}
          borderColor={customTheme.colors.headerBackground}
          backgroundColor={customTheme.colors.headerBackground}
        />
      </View>
      <CustomModal
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        _className="flex-1"
      >
        <ModalHeader>
          <TextInput
            value={search}
            autoFocus
            selectionColor={customTheme.colors.primary}
            placeholderTextColor={customTheme.colors.primary}
            placeholder={`${i18n.t("search")}...`}
            className={`space-x-2 p-3 text-white ${
              i18n.locale === "ar" ? "text-right" : "text-left"
            } border border-gray-400 rounded-full m-3 p-2 px-5`}
            onFocus={() => setModalVisible(true)}
            onChangeText={setSearch}
          />
        </ModalHeader>
        <ModalBody _className="flex-1">
          <VehiclesList
            data={vehicles}
            callBack={() => setModalVisible(false)}
          />
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity
            className="border border-gray-400 rounded-md p-2 px-3"
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text className="text-primary">{i18n.t("ok")}</Text>
          </TouchableOpacity>
        </ModalFooter>
      </CustomModal>
    </View>
  );
};

export default Header;
