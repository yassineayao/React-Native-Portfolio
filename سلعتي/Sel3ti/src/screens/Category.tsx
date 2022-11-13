/** * File: Category.js
 * Description: Load and render the main screen rendered while login into the app
 */
// import _ from "lodash";

import React from "react";

import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import { SearchBarBaseProps } from "react-native-elements/dist/searchbar/SearchBar";

import Icon from "react-native-vector-icons/FontAwesome5";

import HorizontalCategories from "../components/HorizontalCategories";

import { LoadCategories, loadFamilies } from "../data/server";

import { COLORS, SIZES } from "../constants/Theme";
import i18n from "../locales/i18n";
import { TCategory, TFamily } from "../types";
import ProductsList from "../components/ProductsList";

const SafeSearchBar = SearchBar as unknown as React.FC<SearchBarBaseProps>;

const Item = (prop: {
  item: TFamily;
  index: number;
  switchResultPage: Function;
}) => {
  /**
   * Render a single item in the list of families.
   */

  const handleItemClick = () => {
    // Move to families list page
    prop.switchResultPage(1, true);
  };

  const source = {
    uri: prop.item.image,
  };

  return (
    <View key={prop.index} className="p-2">
      <TouchableOpacity
        className="shadow-md shadow-black rounded-2xl overflow-hidden"
        key={prop.index}
        onPress={handleItemClick}
      >
        <ListItem hasTVPreferredFocus tvParallaxProperties>
          <Image
            source={source}
            className="w-[70] h-[70] rounded-lg"
            resizeMode="cover"
          />
          <ListItem.Content>
            <ListItem.Title>{prop.item.name}</ListItem.Title>
          </ListItem.Content>
          <View
            style={{
              marginRight: 22,
            }}
          >
            {prop.item.is_promoted && (
              <Icon name="gift" size={20} color={COLORS.primary} />
            )}
          </View>
        </ListItem>
      </TouchableOpacity>
    </View>
  );
};

const randerSwiperItem = (prop: { item: JSX.Element }) => {
  return prop.item;
};

function Category() {
  /**
   * React component render the list of families
   */
  const [families, setFamilies] = React.useState<TFamily[]>([]);
  const [allFamilies, setAllFamilies] = React.useState<TFamily[]>([]);
  const [categories, setCategories] = React.useState<TCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [loadingProducts, setLoadingProducts] = React.useState(true);

  let swiperRef = React.useRef<React.LegacyRef<FlatList<JSX.Element>>>(); // NOTE: Used to navigate between sceens

  React.useEffect(() => {
    // NOTE: Load categories
    LoadCategories(setCategories, setLoadingProducts);
  }, []);

  React.useEffect(() => {
    // Load families correspond to the selected category
    const category_name = categories[selectedCategory]?.name;
    if (allFamilies.length === 0) {
      loadFamilies(
        setAllFamilies,
        allFamilies,
        category_name,
        1,
        setPage,
        setLoadingProducts
      );
    }
  }, [categories]);

  React.useEffect(() => {
    // Load families correspond to the selected category
    setPage(1);
    setFamilies([]);
    setLoadingProducts(true);
    loadFamilies(
      setAllFamilies,
      allFamilies,
      categories[selectedCategory]?.name,
      1,
      setPage,
      setLoadingProducts,
      true
    );
  }, [selectedCategory]);

  React.useEffect(() => {
    setFamilies(allFamilies);
  }, [allFamilies]);

  const handleScroll = () => {
    // Load families while scrolling
    const category_name = categories[selectedCategory]?.name;
    setLoadingProducts(true);
    loadFamilies(
      setAllFamilies,
      allFamilies,
      category_name,
      page,
      setPage,
      setLoadingProducts
    );
  };

  const switchResultPage = (index: number, animated = false) => {
    if (swiperRef.current instanceof FlatList)
      swiperRef.current?.scrollToIndex({ animated, index: index });
  };

  const handleSearch = (val: string) => {
    // switchResultPage(val.length === 0 ? 0 : 1);
    setSearch(val);
  };

  const renderItem = (index: number, item: TFamily) => {
    return (
      <Item item={item} index={index} switchResultPage={switchResultPage} />
    );
  };

  const renderFooter = () => {
    return loadingProducts ? (
      <ActivityIndicator animating size={60} color={COLORS.primary} />
    ) : (
      families.length === 0 && (
        <View
          style={{
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
            marginHorizontal: SIZES.width * 0.05,
          }}
        >
          {<Icon name="crosshairs" size={SIZES.width * 0.9} color={"red"} />}
        </View>
      )
    );
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.white,
      }}
    >
      <SafeSearchBar
        platform="android"
        value={search}
        onChangeText={handleSearch}
        placeholder={i18n.t("category_search_input")}
        inputStyle={{
          textAlign: "right",
        }}
        containerStyle={{
          width: SIZES.width,
          backgroundColor: COLORS.white,
        }}
        inputContainerStyle={{
          backgroundColor: COLORS.lightGray,
          borderRadius: SIZES.radius,
          elevation: 5,
        }}
        onClear={() => switchResultPage(0)}
      />
      <HorizontalCategories
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <View
        style={{
          flex: 1,
          width: SIZES.width,
        }}
      >
        {families.length > 0 ? (
          <FlatList
            renderItem={randerSwiperItem}
            data={[
              <FlatList
                key={1}
                data={families}
                renderItem={({ index, item }) => renderItem(index, item)}
                onEndReached={handleScroll}
                onEndReachedThreshold={0.5}
                style={{
                  width: SIZES.width,
                }}
              />,
              <ProductsList
                switchResultPage={switchResultPage}
                key={0}
                search={search}
                category={categories[selectedCategory].name}
              />,
            ]}
            ref={swiperRef as React.LegacyRef<FlatList<JSX.Element>>}
            // initialScrollIndex={1}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            scrollEnabled={false}
          />
        ) : (
          renderFooter()
        )}
      </View>
    </View>
  );
}

export default Category;
