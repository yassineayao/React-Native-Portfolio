/**
 * File: Favorite.js
 * Description: Render the screen contain the list of favorite products
 */
import React from "react";
import { FlatList, View } from "react-native";
import { COLORS, SIZES } from "../constants/Theme";
import Icon from "react-native-vector-icons/FontAwesome5";

import { TOrderItem } from "../types";
import SwipeableCard from "../components/SwipeableCard";

const Item = (props: { item: TOrderItem; index: number }) => {
  /**
   * Render a single item in the list of products.
   */

  const handleOnDelete = () => {};

  return (
    <SwipeableCard
      handleOnDelete={handleOnDelete as () => {}}
      index={props.index}
      item={props.item as TOrderItem}
    />
  );
};
const Favorites = () => {
  /**
   * render the list of favorite products
   * @param favoriteProducts the list of favorite products
   */

  const [favoriteProducts, setFavoritesProducts] = React.useState<TOrderItem[]>(
    [
      {
        id: 0,
        is_promoted: false,
        price: "89.99",
        product: {
          id: "8",
          image:
            "https://www.echoroukonline.com/wp-content/uploads/2021/03/%D8%A7%D9%84%D9%82%D9%85%D8%AD.jpg",
          name: "name",
        },
        quantity: 0,
      },
    ]
  );

  const renderItem = (prop: { item: TOrderItem; index: number }) => {
    return <Item item={prop.item} index={prop.index} />;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      {favoriteProducts?.length > 0 ? (
        <FlatList
          data={favoriteProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={true}
          style={{
            flex: 1,
            paddingTop: SIZES.padding,
            paddingBottom: SIZES.padding,
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            name="heart"
            size={SIZES.width * 0.9}
            color={COLORS.secondary}
          />
        </View>
      )}
    </View>
  );
};

export default Favorites;
