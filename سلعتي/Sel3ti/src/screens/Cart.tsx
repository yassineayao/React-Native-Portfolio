/**
 * File: Orders.js
 * Description: Render the Cart screen whitch contains the list of ordered products.
 */
import React from "react";
import { Alert, FlatList } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

import { View } from "react-native";

import { COLORS, SIZES } from "../constants/Theme";
import { Button } from "react-native-elements";
import OrderSummary from "../components/OrderSummary";

import _ from "lodash";
import i18n from "../locales/i18n";
import { TOrderItem } from "../types";
import SwipeableCard from "../components/SwipeableCard";

const Item = (prop: { order: TOrderItem; index: number }) => {
  /**
   * Render a single product in the list of ordered products
   * @param order contains the ordered product info
   */

  const handleOnDelete = async () => {
    Alert.alert(
      i18n.t("orders_ondelete_alert_title"),
      i18n.t("orders_ondelete_alert_message"),
      [
        {
          text: i18n.t("orders_ondelete_alert_positive_btn_txt"),
          style: "destructive",
          onPress: () => {
            // TODO: Send new orders or new updates to the server
          },
        },
        {
          text: i18n.t("alert_nigative_btn_txt"),
          style: "cancel",
        },
      ]
    );
  };

  return (
    <SwipeableCard
      handleOnDelete={handleOnDelete}
      index={prop.index}
      item={prop.order}
    />
  );
};

const Cart = () => {
  /**
   * render the list of ordered products
   * @param orders list of orderd products
   * @param navigation object used to navigate between the app screens
   */
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [orders, setOrders] = React.useState<TOrderItem[]>([
    {
      id: 0,
      is_promoted: false,
      price: "37",
      quantity: 8,
      product: {
        id: "3",
        image:
          "https://www.echoroukonline.com/wp-content/uploads/2021/03/%D8%A7%D9%84%D9%82%D9%85%D8%AD.jpg",
        name: "name",
      },
    },
  ]);
  const [info, setInfo] = React.useState<TOrderItem[]>([]);
  const [extra, setExtra] = React.useState({
    total: 0,
  });

  React.useEffect(() => {
    if (modalVisible) {
      const tmpInfo: TOrderItem[] = [];
      let id = 0;
      const moreInfo = { total: 0.0 };
      moreInfo.total = 0;
      for (const order of orders) {
        // TODO: Correct the price calculation
        const price = parseFloat(order.price) * order.quantity;
        tmpInfo.push({
          ...order,
          id: id++,
          price: price.toFixed(2),
        });
        moreInfo.total += price;
      }
      moreInfo.total = moreInfo.total;
      setInfo(tmpInfo);
      setExtra(moreInfo);
    }
  }, [modalVisible]);

  const renderItem = (prop: { index: number; item: TOrderItem }) => {
    return <Item order={prop.item} index={prop.index} />;
  };

  const handleClear = () => {
    // remove all products from the current order
    Alert.alert(
      i18n.t("orders_onclear_alert_title"),
      i18n.t("orders_onclear_alert_message"),
      [
        {
          text: i18n.t("orders_onclear_alert_positive_btn_txt"),
          onPress: () => {
            // setQuantities(quantities, null, true);
          },
        },
        {
          text: i18n.t("alert_nigative_btn_txt"),
          style: "cancel",
        },
      ]
    );
  };

  const handleSubmit = () => {
    setModalVisible(true);
  };

  return orders && orders.length > 0 ? (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.white,
      }}
    >
      {/* {info.length > 0 && ( */}
      <OrderSummary
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setIsSubmitted={setIsSubmitted}
        orders={info}
        total={"89"}
        extra={extra}
      />
      {/* )} */}
      <FlatList data={orders} renderItem={renderItem} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          title={
            isSubmitted
              ? i18n.t("orders_onsubmit_alert_update_order_btn_txt")
              : i18n.t("orders_onsubmit_alert_positive_btn_txt")
          }
          type="outline"
          titleStyle={{
            color: COLORS.white,
          }}
          containerStyle={{
            flex: 1,
            margin: SIZES.padding,
            backgroundColor: COLORS.success,
          }}
          onPress={handleSubmit}
        />
        {!isSubmitted && (
          <Button
            title={i18n.t("orders_onclear_alert_positive_btn_txt")}
            type="outline"
            titleStyle={{
              color: COLORS.white,
            }}
            containerStyle={{
              flex: 1,
              margin: SIZES.padding,
              backgroundColor: COLORS.danger,
            }}
            onPress={handleClear}
          />
        )}
      </View>
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white,
      }}
    >
      <Icon
        name="shopping-cart"
        size={SIZES.width * 0.8}
        color={COLORS.secondary}
      />
    </View>
  );
};

export default Cart;
