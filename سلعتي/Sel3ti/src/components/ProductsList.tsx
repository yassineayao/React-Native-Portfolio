import _ from "lodash";
import React from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ListItem, Text } from "react-native-elements";

import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome5";
import { COLORS, SIZES } from "../constants/Theme";
import { LoadProducts } from "../data/server";

import i18n from "../locales/i18n";
import { TCartItem, TFamily, TProduct } from "../types";

const Item = (props: { item: TCartItem }) => {
  /**
   * Render a single item in the list of products.
   */

  const [isFavorite, setIsFavorite] = React.useState(false);
  const [quantity, setQuantity] = React.useState(0);
  /**
   * Render a single item in the list of products.
   */
  const handleQuantity = (val: number) => {
    setQuantity(Math.max(val, 0));
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const source = {
    uri: props.item.product ? props.item.product.image : "",
  };
  return (
    <React.Fragment>
      <View className="p-2">
        <ListItem
          className="shadow-md shadow-black rounded-2xl overflow-hidden"
          hasTVPreferredFocus={undefined}
          tvParallaxProperties={undefined}
        >
          <View className="flex-row">
            <TouchableOpacity
              style={{
                justifyContent: "center",
              }}
              onPress={handleFavorite}
            >
              <Image
                source={source}
                className="w-[100] h-[100] mx-1 rounded-lg"
                resizeMode="cover"
              />
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="heart"
                  size={70}
                  color={isFavorite ? COLORS.lightPrimary : COLORS.transparent}
                />
              </View>
            </TouchableOpacity>
            <ListItem.Content>
              <ListItem.Title>{props.item.product?.name}</ListItem.Title>
              <ListItem.Subtitle>
                {parseFloat(props.item.price).toFixed(2)} {i18n.t("currency")}
              </ListItem.Subtitle>
            </ListItem.Content>
            {props.item.is_promoted && (
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
            {
              // TITLE: Quantity
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: SIZES.padding,
                }}
              >
                <TouchableOpacity
                  className={`
                      w-[20]
                      h-[20]
                      rounded-tl-full
                      rounded-bl-full
                      bg-primary
                      justify-center
                      items-center
                    `}
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
                  className={`
                      w-[20]
                      h-[20]
                      rounded-tr-full
                      rounded-br-full
                      bg-primary
                      justify-center
                      items-center
                    `}
                  onPressIn={() => handleQuantity(quantity + 1)}
                >
                  <Text className="text-gray-200">+</Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        </ListItem>
      </View>
    </React.Fragment>
  );
};

const renderItem = (item: TCartItem) => {
  return <Item item={item} />;
};

function ProductsList(props: {
  switchResultPage: Function;
  category: string;
  // isReclamation: boolean;
  search: string;
}) {
  const [products, setProducts] = React.useState<TCartItem[]>([]);
  const [allProducts, setAllProducts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [loadingProducts, setLoadingProducts] = React.useState(true);
  // const [isBanned, setIsBanned] = React.useState(false);

  // TODO: Move to redux store
  const [family, setFamily] = React.useState<TFamily>({
    id: "0",
    name: "المطاحن",
    image: "",
    is_promoted: false,
  });

  React.useEffect(() => {
    setAllProducts([]);
  }, []);

  React.useEffect(() => {
    // Load products correspond to the selected family
    setPage(1);
    setProducts([]);
    setLoadingProducts(true);
    LoadProducts(
      setAllProducts,
      allProducts,
      props.category,
      family.name,
      1,
      setPage,
      setLoadingProducts,
      // setIsBanned,
      true
    );
  }, [family.name]);

  React.useEffect(() => {
    // set allFamilies state
    if (props.search.length > 0) {
      setProducts(
        allProducts.filter((product: TProduct) =>
          product.name.toLowerCase().includes(props.search.toLowerCase())
        )
      );
    } else {
      setProducts(allProducts);
    }
  }, [allProducts]);

  const handleScroll = () => {
    // Load families while scrolling
    setLoadingProducts(true);
    LoadProducts(
      setAllProducts,
      allProducts,
      props.category,
      family.name,
      page,
      setPage,
      setLoadingProducts
    );
  };

  const makeRemoteSearch = _.debounce((val: string) => {
    setLoadingProducts(true);
    LoadProducts(
      setAllProducts,
      allProducts,
      props.category,
      null,
      page,
      setPage,
      setLoadingProducts,
      false,
      val
    );
  }, 250);

  React.useEffect(() => {
    setProducts(
      allProducts.filter((item: { product: TProduct }) =>
        item.product.name.toLowerCase().includes(props.search.toLowerCase())
      )
    );
    if (props.search.length > 0) {
      setPage(1);
      makeRemoteSearch(props.search.toLowerCase());
    }
  }, [props.search]);

  const renderFooter = () => {
    return loadingProducts ? (
      <ActivityIndicator animating size={60} color={COLORS.primary} />
    ) : (
      <View
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          marginHorizontal: SIZES.width * 0.05,
        }}
      >
        {
          <Icon
            name="crosshairs"
            size={SIZES.width * 0.9}
            color={COLORS.secondary}
          />
        }
      </View>
    );
  };

  return (
    <View
      style={{
        width: SIZES.width,
      }}
    >
      {props.search.trim().length === 0 && (
        <TouchableOpacity
          style={{
            right: 0,
          }}
          onPress={() => {
            props.switchResultPage(0, true);
          }}
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color={COLORS.black}
            style={{
              transform: [{ rotateY: "180deg" }],
            }}
          />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        {!_.isEmpty(products) ? (
          <FlatList
            data={products}
            renderItem={(prop: { item: TCartItem }) => renderItem(prop.item)}
            onEndReached={handleScroll}
            refreshing={true}
            bounces
            onEndReachedThreshold={0.5}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              marginBottom: 20,
            }}
          />
        ) : (
          <ActivityIndicator animating size={60} color={COLORS.primary} />
        )}
      </View>
    </View>
  );
}

export default ProductsList;
