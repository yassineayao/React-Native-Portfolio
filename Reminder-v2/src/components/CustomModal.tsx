import { View, Modal, NativeSyntheticEvent } from "react-native";
import React from "react";
import { customTheme } from "../constants/theme";
import i18n from "../services/i18n";

const ModalHeader = (prop: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <View
      className="bg-blue-700"
      style={{
        backgroundColor: customTheme.colors.headerBackground,
      }}
    >
      {prop.children}
    </View>
  );
};

const ModalBody = (prop: {
  _className?: string;
  children?: JSX.Element | JSX.Element[];
}) => {
  return <View className={prop._className}>{prop.children}</View>;
};

const ModalFooter = (prop: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <View
      className={`${
        i18n.locale === "ar" ? "flex-row" : "flex-row-reverse"
      } p-3 w-full`}
      style={{
        backgroundColor: customTheme.colors.headerBackground,
      }}
    >
      {prop.children}
    </View>
  );
};

const CustomModal = (prop: {
  visible: boolean;
  onRequestClose?: (event: NativeSyntheticEvent<any>) => void;
  _className?: string;
  children: JSX.Element | JSX.Element[];
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={prop.visible}
      onRequestClose={prop.onRequestClose}
    >
      <View className="bg-black/[.4] justify-center flex-1">
        <View
          className={`bg-white m-5 rounded-xl overflow-hidden ${prop._className}`}
        >
          {prop.children}
        </View>
      </View>
    </Modal>
  );
};

export { CustomModal, ModalHeader, ModalBody, ModalFooter };
