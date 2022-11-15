/**
 * File: OrderSummary.js
 * Description: render the list of ordered products info before submit it.
 */
import React from "react";
import { Button, CheckBox, ListItem } from "react-native-elements";
import { View, FlatList, Text } from "react-native";
import Modal from "react-native-modal";

import { TIMBER } from "../constants/settings";
import { SIZES } from "../constants/Theme";
import i18n from "../locales/i18n";
import { TOrderItem } from "../types";
// import { sendOrders } from "../data/server";

const OrderSummary = (props: {
  modalVisible: boolean;
  setModalVisible: Function;
  setIsSubmitted: Function;
  orders: TOrderItem[];
  total: string;
  extra: { total: number };
}) => {
  /**
   * Render the list of ordered products info
   * @param props contains the list of ordered products info
   */
  const [paymentMode, setPaymentMode] = React.useState("CA");

  const renderItem = (prop: { item: TOrderItem }) => {
    /**
     * render a single row in the list of ordered products info.
     * @param item contains a single ordered product info
     */
    return (
      <View className="shadow-sm p-2 rounded-sm shadow-black">
        <ListItem.Content>
          <ListItem.Title>{prop.item.product.name}</ListItem.Title>
          <View className="flex-row justify-between w-full">
            <Text>الكمية: {prop.item.quantity}</Text>
            <Text>
              الثمن: {prop.item.price} {i18n.t("currency")}
            </Text>
          </View>
        </ListItem.Content>
      </View>
    );
  };

  return (
    <Modal
      isVisible={props.modalVisible}
      onDismiss={() => props.setModalVisible(false)}
      hardwareAccelerated
      statusBarTranslucent
      animationIn="slideInUp"
      animationOut="slideInDown"
    >
      <View className="bg-white rounded-lg p-2 flex-1">
        <FlatList data={props.orders} renderItem={renderItem} />
        <View className="p-2 border-b w-full justify-center">
          <View className="flex-row justify-center">
            <CheckBox
              center
              title="Check"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={paymentMode === "CE"}
              onPress={() => setPaymentMode("CE")}
            />
            <CheckBox
              center
              title="Cash"
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={paymentMode === "CA"}
              onPress={() => setPaymentMode("CA")}
            />
          </View>
          <View className="flex-row w-full justify-center">
            <Text className="text-green-700 text-lg">
              {" "}
              {props.extra.total.toFixed(2)} {i18n.t("currency")}
            </Text>
            <Text className="text-black text-lg">
              {i18n.t("exportpdf_template_foot_total")}:{" "}
            </Text>
          </View>
        </View>
        <Button
          title={i18n.t("orders_onsubmit_alert_positive_btn_txt")}
          onPress={async () => {
            if (paymentMode === "CA") {
              // Note: Update price in the Cash mode
              for (let i = 0; i < props.orders.length; i++) {
                props.orders[i].price = (
                  parseFloat(props.orders[i].price) *
                  (1 + TIMBER)
                ).toFixed(2);
              }
            }
            // sendOrders(props.orders);
            props.setIsSubmitted(true);
            props.setModalVisible(false);
          }}
          type="outline"
          className="w-full p-2"
          containerStyle={{
            paddingTop: SIZES.padding,
          }}
        />
        <Button
          title={i18n.t("alert_nigative_btn_txt")}
          onPress={() => props.setModalVisible(false)}
          type="outline"
          className="py-2 my-2"
          containerStyle={{
            paddingTop: SIZES.padding,
          }}
        />
      </View>
    </Modal>
  );
};

export default OrderSummary;
