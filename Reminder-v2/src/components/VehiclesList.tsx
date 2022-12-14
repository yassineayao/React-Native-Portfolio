import { View, FlatList } from "react-native";
import React from "react";
import ListItemCard from "../components/ListItemCard";
import { Vehicle } from "../types";

const renderItem = (prop: { item: Vehicle; callBack?: Function }) => {
  return <ListItemCard vehicle={prop.item} callBack={prop.callBack} />;
};

const VehiclesList = (prop: {
  data: Vehicle[];
  refreshing?: boolean;
  onRefresh?: () => void;
  children?: JSX.Element | JSX.Element[];
  callBack?: Function;
}) => {
  return (
    <View className="flex-1 bg-containerBackground">
      <FlatList
        data={prop.data}
        renderItem={({ item }) => renderItem({ item, callBack: prop.callBack })}
        contentContainerStyle={{
          paddingBottom: 30,
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        refreshing={prop.refreshing}
        onRefresh={prop.onRefresh}
      />
      {prop.children}
    </View>
  );
};

export default VehiclesList;
