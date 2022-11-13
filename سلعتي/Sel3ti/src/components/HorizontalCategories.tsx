/**
 * File: HorizontalCategories.js
 * Description: Render the slide under the search bar, contains the list of categories.
 */
import React from "react";
import { TouchableOpacity, Text, View, FlatList, Image } from "react-native";
import { SIZES } from "../constants/Theme";
import { TCategory } from "../types";

export default function HorizontalCategories(props: {
  setSelectedCategory: Function;
  selectedCategory: number;
  categories: TCategory[];
}) {
  /**
   * Render a list of categories slided horizontally
   * @param {props} param0 Contains list of categories info
   * @returns render a list of categories components
   */

  const renderItem = (prop: { index: number; item: TCategory }) => {
    /**
     * Format and return an item from the list
     */
    const handleOnSelectCategory = () => {
      requestAnimationFrame(() => {
        props.setSelectedCategory(prop.index);
      });
    };
    return (
      <TouchableOpacity
        className={`
          px-1
          py-4
          rounded-full
          justify-center
          items-center
          mx-2
          shadow-lg
          shadow-black
          ${props.selectedCategory === prop.index ? "bg-primary" : "bg-white"}
        `}
        onPress={handleOnSelectCategory}
      >
        <View
          className={`
            w-[50]
            h-[50]
            rounded-full
            justify-center
            items-center
            overflow-hidden
            ${
              props.selectedCategory === prop.index ? "bg-white" : "bg-gray-200"
            }
          `}
        >
          <Image
            source={{ uri: prop.item.image }}
            className="w-[50] h-[50] rounded-lg"
            resizeMode="cover"
          />
        </View>
        <Text
          className={`
            m-2
            ${
              props.selectedCategory === prop.index
                ? "text-white"
                : "text-black"
            }
          `}
        >
          {prop.item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={props.categories}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => `${item.id}`}
      renderItem={renderItem}
      className="max-h-[100]"
      contentContainerStyle={{
        paddingVertical: SIZES.padding * 2,
        paddingHorizontal: SIZES.padding,
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}
