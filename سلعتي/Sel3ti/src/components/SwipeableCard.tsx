import React from "react";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import i18n from "../locales/i18n";
import { COLORS, SIZES } from "../constants/Theme";
import { TOrderItem } from "../types";

const SwipeableCard = (prop: {
  item: TOrderItem;
  index: number;
  handleOnDelete: () => {};
}) => {
  const [quantity, setQuantity] = React.useState(prop.item.quantity);
  function handleQuantity(val: number) {
    // initialize quantity
    setQuantity(val);
  }

  return (
    <View className="p-1 w-full">
      <GestureHandlerRootView>
        <Swipeable
          containerStyle={{
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}
          renderRightActions={() => (
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
                onPress={prop.handleOnDelete}
              />
            </View>
          )}
        >
          <ListItem
            className="shadow-md shadow-black rounded-2xl overflow-hidden"
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
          >
            <View className="flex-row">
              <Image
                source={{ uri: prop.item.product.image }}
                className="w-[70] h-[70] mr-2 rounded-lg"
                resizeMode="cover"
              />
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
                  onPressIn={() => handleQuantity(Math.max(quantity - 1, 0))}
                >
                  <Text className="text-gray-200">-</Text>
                </TouchableOpacity>
                <TextInput
                  className="text-center"
                  onChangeText={(el) => handleQuantity(Number(el))}
                  value={quantity.toString()}
                />
                <TouchableOpacity
                  className="bg-primary w-[20] h-[20] rounded-r-full justify-center items-center"
                  onPressIn={() => handleQuantity(quantity + 1)}
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
