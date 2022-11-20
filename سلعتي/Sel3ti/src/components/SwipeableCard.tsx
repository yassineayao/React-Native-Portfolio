import React from "react";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, ListItem } from "react-native-elements";

import { useDispatch, useSelector } from "react-redux";

import Icon from "react-native-vector-icons/FontAwesome5";
import i18n from "../locales/i18n";
import { COLORS, SIZES } from "../constants/Theme";
import { TOrderItem } from "../types";
import {
  AddFavorite,
  removeFavorite,
} from "../features/favorites/favoritesSlice";
import {
  addOrder,
  removeOrder,
  updateItemQuantity,
} from "../features/orders/ordersSlice";

const SwipeableCard = (prop: {
  item: TOrderItem;
  index: number;
  isSwipeable?: boolean;
  handleOnDelete?: (item: TOrderItem) => void | undefined;
}) => {
  const quantity = useSelector((state: { order: { items: TOrderItem[] } }) => {
    const items = state.order.items.filter(
      (order) => order.id === prop.item.id
    );
    if (!items.length) return 0;
    else return items[0].quantity;
  });

  const isFavorite = useSelector(
    (state: { favorite: { items: TOrderItem[] } }) => {
      const items = state.favorite.items.filter(
        (favorite) => favorite.id === prop.item.id
      );
      return items.length === 1;
    }
  );

  const dispatch = useDispatch();

  const toggleFavorite = (favorite: TOrderItem) => {
    if (isFavorite) dispatch(removeFavorite(favorite));
    else dispatch(AddFavorite(favorite));
  };

  function handleQuantity(val: number) {
    // initialize quantity
    const order = {
      id: prop.item.id,
      is_promoted: prop.item.is_promoted,
      price: prop.item.price,
      product: prop.item.product,
      quantity: val,
    };
    if (quantity === 0) dispatch(addOrder(order));
    else if (val === 0) dispatch(removeOrder(order));
    else dispatch(updateItemQuantity(order));
  }

  function handleOnDelete() {
    if (prop.handleOnDelete) prop.handleOnDelete(prop.item);
  }

  return (
    <View className="p-1 w-full">
      <GestureHandlerRootView>
        <Swipeable
          containerStyle={{
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}
          renderRightActions={() => null}
          renderLeftActions={() =>
            prop.isSwipeable ? (
              <View className="py-2 px-1">
                <Button
                  title={i18n.t("orders_swipeable_delete_btn_title")}
                  icon={{ name: "delete", color: "white", size: 25 }}
                  buttonStyle={{
                    height: "100%",
                    backgroundColor: COLORS.danger,
                    marginHorizontal: SIZES.padding,
                    padding: SIZES.padding,
                    borderRadius: SIZES.radius1,
                  }}
                  onPress={handleOnDelete}
                />
              </View>
            ) : null
          }
        >
          <ListItem
            className="shadow-md shadow-black rounded-2xl overflow-hidden"
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
          >
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => {
                  toggleFavorite(prop.item);
                }}
              >
                <View>
                  <Image
                    source={{ uri: prop.item.product.image }}
                    className="w-[70] h-[70] mr-2 rounded-lg"
                    resizeMode="cover"
                  />
                  {isFavorite && (
                    <View className="absolute w-full h-full justify-center items-center">
                      <Icon name="heart" size={50} color={COLORS.primary} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <ListItem.Content>
                <ListItem.Title className="text-lg">
                  {prop.item.product.name}
                </ListItem.Title>
                <ListItem.Subtitle>
                  {prop.item.price} {i18n.t("currency")}
                </ListItem.Subtitle>
              </ListItem.Content>
              {prop.item.is_promoted && (
                <View
                  style={{
                    marginRight: 22,
                    position: "absolute",
                    backgroundColor: COLORS.white,
                    padding: 3,
                    borderRadius: 100,
                  }}
                >
                  <Icon name="gift" size={25} color={COLORS.primary} />
                </View>
              )}
              {/* 	TITLE: Quantity */}
              <View className="flex-row p-2 justify-center items-center">
                <TouchableOpacity
                  className="bg-primary w-[20] h-[20] rounded-l-full justify-center items-center"
                  onPress={() => handleQuantity(Math.max(quantity - 1, 0))}
                >
                  <Text className="text-gray-200">-</Text>
                </TouchableOpacity>
                <TextInput
                  keyboardType="decimal-pad"
                  className="text-center"
                  onChangeText={(el) => handleQuantity(Number(el))}
                  value={quantity?.toString()}
                />
                <TouchableOpacity
                  className="bg-primary w-[20] h-[20] rounded-r-full justify-center items-center"
                  onPress={() => handleQuantity(quantity + 1)}
                >
                  <Text className="text-gray-200">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ListItem>
        </Swipeable>
      </GestureHandlerRootView>
    </View>
  );
};

export default SwipeableCard;
