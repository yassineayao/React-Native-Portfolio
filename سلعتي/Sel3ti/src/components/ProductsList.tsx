import _ from "lodash";
import React from "react";

import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS, SIZES } from "../constants/Theme";
import { LoadProducts } from "../data/server";

import { TOrderItem, TFamily, TProduct } from "../types";
import SwipeableCard from "./SwipeableCard";

const renderItem = (item: TOrderItem, index: number) => {
  return <SwipeableCard index={index} item={item} />;
};

function ProductsList(props: {
  switchResultPage: Function;
  category: string;
  search: string;
}) {
  const [products, setProducts] = React.useState<TOrderItem[]>([]);
  const [allProducts, setAllProducts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [loadingProducts, setLoadingProducts] = React.useState(true);

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
      true
    );
  }, [family.name]);

  React.useEffect(() => {
    // set allFamilies state
    if (props.search.length > 0) {
      setProducts(
        allProducts.filter((item: { product: TProduct }) =>
          item.product.name.toLowerCase().includes(props.search.toLowerCase())
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
            renderItem={(prop: { item: TOrderItem; index: number }) =>
              renderItem(prop.item, prop.index)
            }
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
