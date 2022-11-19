/**
 * File: Favorite.js
 * Description: Render the screen contain the list of favorite products
 */
import React, { useEffect } from "react";
import { FlatList, View } from "react-native";
import { COLORS, SIZES } from "../constants/Theme";
import Icon from "react-native-vector-icons/FontAwesome5";

import { TOrderItem } from "../types";
import SwipeableCard from "../components/SwipeableCard";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { DELETE_FAVORITE, RESTORE_FAVORITES } from "../redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Favorites = () => {
  const favoriteProducts = useSelector(
    (state: AnyAction) => state.favorite.items
  );
  const dispatch = useDispatch();
  const deleteFavorite = (item: TOrderItem) =>
    dispatch({ type: DELETE_FAVORITE, payload: { favorite: item } });

  useEffect(() => {
    AsyncStorage.getItem("Favorites", (e, v) => {
      if (v) {
        dispatch({
          type: RESTORE_FAVORITES,
          payload: { favorite: JSON.parse(v) },
        });
      }
    });
  }, []);
  const renderItem = (prop: { item: TOrderItem; index: number }) => {
    return (
      <SwipeableCard
        handleOnDelete={deleteFavorite as (item: TOrderItem) => void}
        index={prop.index}
        item={prop.item as TOrderItem}
        isSwipeable
      />
    );
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
