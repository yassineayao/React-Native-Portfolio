/**
 * File: Orders.js
 * Description: Render the Cart screen whitch contains the list of ordered products.
 */
import React, { useState } from "react";
import { Alert, FlatList } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

import { useSelector, useDispatch } from "react-redux";

import { View } from "react-native";

import { COLORS, SIZES } from "../constants/Theme";
import { Button } from "react-native-elements";
import OrderSummary from "../components/OrderSummary";

import _ from "lodash";
import i18n from "../locales/i18n";
import { TOrderItem } from "../types";
import SwipeableCard from "../components/SwipeableCard";
import { CLEAN_CART, RMEOVE_ORDER } from "../redux/actions";

const Cart = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [info, setInfo] = useState<TOrderItem[]>([]);
  const [extra, setExtra] = useState({
    total: 0,
  });

  const items: TOrderItem[] = useSelector(
    (state: { order: { items: TOrderItem[] } }) => state.order.items
  );
  const dispatch = useDispatch();
  const cleanCart = () => dispatch({ type: CLEAN_CART });
  const deleteOrder = (item: TOrderItem) =>
    dispatch({ type: RMEOVE_ORDER, payload: { order: item } });

  React.useEffect(() => {
    if (modalVisible) {
      const tmpInfo: TOrderItem[] = [];
      let id = 0;
      const moreInfo = { total: 0.0 };
      moreInfo.total = 0;
      for (const order of items) {
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
    return (
      <SwipeableCard
        index={prop.index}
        item={prop.item}
        handleOnDelete={deleteOrder as (item: TOrderItem) => void}
        isSwipeable
      />
    );
  };

  const handleClean = () => {
    // remove all products from the current order
    Alert.alert(
      i18n.t("orders_onclear_alert_title"),
      i18n.t("orders_onclear_alert_message"),
      [
        {
          text: i18n.t("orders_onclear_alert_positive_btn_txt"),
          onPress: cleanCart,
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

  return items && items.length > 0 ? (
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
      <FlatList data={items} renderItem={renderItem} />
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
            onPress={handleClean}
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
