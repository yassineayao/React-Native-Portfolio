import React, { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import VehiclesList from "../components/VehiclesList";
import { Vehicle } from "../types";
import { sharedValues } from "../contexts/SharedValues";

const UnpaidListScreen = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const context = useContext(sharedValues);
  const onRefresh = () => {
    context.db.getAllVehicles((vehicles: Vehicle[]) => {
      setRefreshing(true);
      setVehicles(vehicles);
      setRefreshing(false);
    }, false);
  };
  useEffect(() => {
    context.db.getAllVehicles(setVehicles, false);
  }, []);
  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  );
  return (
    <VehiclesList
      data={vehicles}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

export default UnpaidListScreen;
