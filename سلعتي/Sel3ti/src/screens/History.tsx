/**
 * File: History.js
 * Description: Create, format and render a list of printable invoices and keep it ready
 * 							to print. The print process is started when the user click on an item from
 * 							the list.
 */
import React, { useState } from "react";
import { FlatList, View } from "react-native";
import PrintInvoice from "../components/PrintInvoice";
import Icon from "react-native-vector-icons/FontAwesome";
import { COLORS, SIZES } from "../constants/Theme";
import { TInvoice } from "../types";

const Item = (prop: { item: TInvoice }) => {
  return <PrintInvoice data={prop.item} />;
};

const renderItem = (prop: { item: TInvoice }) => {
  return <Item item={prop.item} />;
};

function History() {
  /**
   * Render a list of printable invoices.
   */
  const [histories, setHistories] = useState<TInvoice[]>([
    {
      client: {
        address: "address",
        name: "name",
        phone: "phone",
      },
      date: new Date(),
      distributor: {
        address: "address",
        name: "name",
        phone: "phone",
      },
      id: "1234",
      order: [
        {
          id: 0,
          is_promoted: false,
          price: "234",
          product: {
            id: "123435",
            image: "",
            name: "product name",
          },
          quantity: 3,
        },
      ],
    },
    {
      client: {
        address: "address",
        name: "name",
        phone: "phone",
      },
      date: new Date(),
      distributor: {
        address: "address",
        name: "name",
        phone: "phone",
      },
      id: "12343",
      order: [
        {
          id: 0,
          is_promoted: false,
          price: "234",
          product: {
            id: "123435",
            image: "",
            name: "product name",
          },
          quantity: 3,
        },
      ],
    },
  ]);

  return histories && histories.length > 0 ? (
    <View className="flex-1 items-center bg-white">
      <FlatList
        renderItem={renderItem}
        data={histories}
        keyExtractor={(item) => item.id}
        className="w-full p-1"
      />
    </View>
  ) : (
    <View className="flex-1 justify-center items-center">
      <Icon
        name="file-archive-o"
        size={SIZES.width * 0.7}
        color={COLORS.secondary}
      />
    </View>
  );
}

export default History;
