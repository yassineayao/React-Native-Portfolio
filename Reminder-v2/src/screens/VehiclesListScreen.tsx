import { TouchableOpacity } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { PlusIcon } from "react-native-heroicons/outline";
import { useFocusEffect } from "@react-navigation/native";
import { customTheme } from "../constants/theme";
import VehiclesList from "../components/VehiclesList";
import { Vehicle } from "../types";
import AddClient from "../components/AddClient";
import { sharedValues } from "../contexts/SharedValues";

const VehiclesListScreen = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const context = useContext(sharedValues);
  const onRefresh = () => {
    context.db.getAllVehicles((vehicles: Vehicle[]) => {
      setRefreshing(true);
      setVehicles(vehicles);
      setRefreshing(false);
    });
  };
  useEffect(() => {
    context.db.getAllVehicles(setVehicles);
  }, []);
  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );
  return (
    <VehiclesList data={vehicles} refreshing={refreshing} onRefresh={onRefresh}>
      <TouchableOpacity
        className="absolute p-3 rounded-full shadow shadow-black bottom-1 right-1 bg-primary"
        onPress={() => setModalVisible(true)}
      >
        <PlusIcon size={30} color={customTheme.colors.headerBackground} />
      </TouchableOpacity>
      <AddClient
        modalVisible={modalVisible}
        setModalVisible={(value: boolean) => {
          onRefresh();
          setModalVisible(value);
        }}
      />
    </VehiclesList>
  );
};

export default VehiclesListScreen;
