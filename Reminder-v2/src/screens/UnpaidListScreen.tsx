import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Database } from "../../database/Database";
import VehiclesList from "../components/VehiclesList";
import { Vehicle } from "../types";

const db = Database.getInstance();
const UnpaidListScreen = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const onRefresh = () => {
    db.getAllVehicles((vehicles: Vehicle[]) => {
      setRefreshing(true);
      setVehicles(vehicles);
      setRefreshing(false);
    }, false);
  };
  useEffect(() => {
    db.getAllVehicles(setVehicles, false);
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
