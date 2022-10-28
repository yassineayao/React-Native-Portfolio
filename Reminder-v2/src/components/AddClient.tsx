import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Checkbox from "expo-checkbox";
import SelectBox from "react-native-multi-selectbox";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  CustomModal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "./CustomModal";
import i18n from "../services/i18n";
import { customTheme } from "../constants/theme";
import { Gaurantor, Vehicle } from "../types";
import { Database } from "../../database/Database";
import { locale } from "../constants/settings";

const db = Database.getInstance();

const defaultIsValid = {
  id: true,
  client: {
    name: true,
    phone: true,
  },
  gaurantor: {
    name: true,
    phone: true,
  },
};

const defaultVehicle = {
  id: "",
  name: "",
  deadline: new Date(),
  client: {
    name: "",
    phone: "",
  },
  gaurantor: {
    name: "",
    phone: "",
  },
  payment: {
    price: "0.0",
    deadline: new Date(),
  },
};

const AddClient = (prop: {
  modalVisible: boolean;
  setModalVisible: Function;
}) => {
  const [vehicle, setVehicle] = useState<Vehicle>(defaultVehicle);
  const [gaurantors, setGaurantors] = useState<Gaurantor[]>([]);
  const [edit, setEdit] = useState({
    deadline: false,
    isGaurantor: false,
    isNewGaurantor: false,
    isRemain: false,
    isRemainDeadline: false,
  });
  const [isValid, setIsValid] = useState({ ...defaultIsValid });

  useEffect(() => {
    db.getAllGaurantors(setGaurantors);
  }, []);

  const toggleEdit = (field: keyof typeof edit) => {
    setEdit({ ...edit, [field]: !edit[field] });
  };

  return (
    <CustomModal
      visible={prop.modalVisible}
      onRequestClose={() => {
        prop.setModalVisible(!prop.modalVisible);
      }}
      _className="flex-1"
    >
      <ModalHeader>
        <View className="p-3">
          <Text className="text-lg text-primary">{i18n.t("new_vehicle")}</Text>
        </View>
      </ModalHeader>
      <ModalBody _className="flex-1 p-3">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Vehicle */}
          <View className="mb-3">
            <Text className="text-center text-2xl font-bold">
              {i18n.t("vehicle")}
            </Text>
            <View className="mt-1">
              <Text className="mb-1">
                {i18n.t("vehicle_id")}
                <Text className="text-red-600">{" * "}</Text>
              </Text>
              <TextInput
                placeholder="J234898"
                className="border border-gray-300 rounded-md p-2"
                value={vehicle.id}
                onChangeText={(value) => {
                  setIsValid({
                    ...isValid,
                    id: value.length > 0,
                  });
                  setVehicle({
                    ...vehicle,
                    id: value,
                  });
                }}
              />
            </View>
            {!isValid.id ? (
              <Text className="text-center text-red-500 text-xs pt-1">
                {i18n.t("empty_field_error")}
              </Text>
            ) : (
              <></>
            )}
            <View className="mt-2">
              <Text className="mb-1">{i18n.t("type")}</Text>
              <TextInput
                placeholder={i18n.t("car")}
                className="border border-gray-300 rounded-md p-2"
                value={vehicle.name}
                onChangeText={(value) =>
                  setVehicle({
                    ...vehicle,
                    name: value,
                  })
                }
              />
            </View>
          </View>

          {/* Client */}
          <View className="mb-3">
            <Text className="text-center text-2xl font-bold">
              {i18n.t("client")}
            </Text>
            <View className="mt-2">
              <Text className="mb-1">
                {i18n.t("full_name")}
                <Text className="text-red-600">{"*"}</Text>
              </Text>
              <TextInput
                placeholder={i18n.t("client_name")}
                className="border border-gray-300 rounded-md p-2"
                value={vehicle.client.name}
                onChangeText={(value) => {
                  setIsValid({
                    ...isValid,
                    client: {
                      ...isValid.client,
                      name: value.length > 0,
                    },
                  });
                  setVehicle({
                    ...vehicle,
                    client: { ...vehicle.client, name: value },
                  });
                }}
              />
              {!isValid.client.name ? (
                <Text className="text-center text-red-500 text-xs pt-1">
                  {i18n.t("empty_field_error")}
                </Text>
              ) : (
                <></>
              )}
            </View>

            <View className="mt-2">
              <Text className="mb-1">
                {i18n.t("phone")}
                <Text className="text-red-600">{"*"}</Text>
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                placeholder="0612345678"
                className="border border-gray-300 rounded-md p-2"
                value={vehicle.client.phone}
                onChangeText={(value) => {
                  // TODO: Check the phone validation in typing time
                  setIsValid({
                    ...isValid,
                    client: {
                      ...isValid.client,
                      phone: value.length > 0,
                    },
                  });
                  setVehicle({
                    ...vehicle,
                    client: { ...vehicle.client, phone: value },
                  });
                }}
              />
              {!isValid.client.phone ? (
                <Text className="text-center text-red-500 text-xs pt-1">
                  {i18n.t("phone_error")}
                </Text>
              ) : (
                <></>
              )}
            </View>
          </View>

          {/* Payment */}
          <View className="mb-3">
            <Text className="text-center text-2xl font-bold">
              {i18n.t("pricing")}
            </Text>
            <View className="mt-2">
              <Text className="mb-1">
                {i18n.t("deadline_date")}
                <Text className="text-red-600">{"*"}</Text>
              </Text>
              {edit.deadline ? (
                <DateTimePicker
                  value={vehicle.deadline}
                  minimumDate={new Date()}
                  mode="date"
                  onChange={(value) => {
                    if (value.type === "dismissed") toggleEdit("deadline");
                    else if (value.type === "set") {
                      // TODO: Change time settings
                      toggleEdit("deadline");
                      setVehicle({
                        ...vehicle,
                        deadline: new Date(value.nativeEvent.timestamp || ""),
                      });
                    }
                  }}
                />
              ) : (
                <TouchableOpacity onPress={() => toggleEdit("deadline")}>
                  <TextInput
                    placeholder={new Date().toLocaleDateString(locale)}
                    className="border border-gray-300 rounded-md p-2"
                    value={vehicle.deadline.toLocaleDateString(locale)}
                    editable={false}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View className="mt-2">
              <Text className="mb-1">
                {i18n.t("remain")} ({i18n.t("dh")})
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                placeholder="0.0"
                className="border border-gray-300 rounded-md p-2 text-center"
                value={`${vehicle.payment.price}`}
                onChangeText={(value) => {
                  setVehicle({
                    ...vehicle,
                    payment: {
                      ...vehicle.payment,
                      price: value,
                    },
                  });
                  if (parseFloat(value) > 0) {
                    setEdit({ ...edit, isRemain: true });
                  } else {
                    setEdit({ ...edit, isRemain: false });
                  }
                }}
              />
            </View>

            {edit.isRemain ? (
              <View className="mt-2">
                <Text className="mb-1">{i18n.t("remain_deadline")}</Text>
                {edit.isRemainDeadline ? (
                  <DateTimePicker
                    value={vehicle.payment.deadline}
                    minimumDate={new Date()}
                    mode="date"
                    onChange={(value) => {
                      toggleEdit("isRemainDeadline");
                      if (value.type === "set") {
                        // TODO: Change time settings
                        setVehicle({
                          ...vehicle,
                          payment: {
                            ...vehicle.payment,
                            deadline: new Date(
                              value.nativeEvent.timestamp || ""
                            ),
                          },
                        });
                      }
                    }}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => toggleEdit("isRemainDeadline")}
                  >
                    <TextInput
                      placeholder={new Date().toDateString()}
                      className="border border-gray-300 rounded-md p-2"
                      value={vehicle.payment.deadline.toDateString()}
                      editable={false}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <></>
            )}
          </View>

          {/* Guarantor */}
          <View className="mb-3">
            <Text className="text-center text-2xl font-bold">
              {i18n.t("guarantor")}
            </Text>
            <View className="mt-2">
              <View
                className={`w-full ${
                  i18n.locale === "ar" ? "items-end" : "items-start"
                }`}
              >
                <Checkbox
                  value={edit.isGaurantor}
                  onValueChange={(value) =>
                    setEdit({
                      ...edit,
                      isGaurantor: value,
                      isNewGaurantor: !value ? false : edit.isNewGaurantor,
                    })
                  }
                  color={
                    edit.isGaurantor
                      ? customTheme.colors.headerBackground
                      : undefined
                  }
                />
              </View>
              {edit.isGaurantor ? (
                edit.isNewGaurantor ? (
                  <View>
                    <View className="mt-2">
                      <Text className="mb-1">
                        {i18n.t("full_name")}
                        <Text className="text-red-600">{"*"}</Text>
                      </Text>
                      <TextInput
                        placeholder={i18n.t("client_name")}
                        className="border border-gray-300 rounded-md p-2"
                        value={vehicle.gaurantor.name}
                        onChangeText={(value) => {
                          setIsValid({
                            ...isValid,
                            gaurantor: {
                              ...isValid.gaurantor,
                              name: value.length > 0,
                            },
                          });
                          setVehicle({
                            ...vehicle,
                            gaurantor: { ...vehicle.gaurantor, name: value },
                          });
                        }}
                      />
                      {!isValid.gaurantor.name ? (
                        <Text className="text-center text-red-500 text-xs pt-1">
                          {i18n.t("empty_field_error")}
                        </Text>
                      ) : (
                        <></>
                      )}
                    </View>

                    <View className="mt-2">
                      <Text className="mb-1">
                        {i18n.t("phone")}
                        <Text className="text-red-600">{"*"}</Text>
                      </Text>
                      <TextInput
                        keyboardType="decimal-pad"
                        placeholder="0612345678"
                        className="border border-gray-300 rounded-md p-2"
                        value={vehicle.gaurantor.phone}
                        onChangeText={(value) => {
                          // TODO: Check the phone validation in typing time
                          setIsValid({
                            ...isValid,
                            gaurantor: {
                              ...isValid.gaurantor,
                              phone: value.length > 0,
                            },
                          });
                          setVehicle({
                            ...vehicle,
                            gaurantor: { ...vehicle.gaurantor, phone: value },
                          });
                        }}
                      />
                      {!isValid.gaurantor.phone ? (
                        <Text className="text-center text-red-500 text-xs pt-1">
                          {i18n.t("phone_error")}
                        </Text>
                      ) : (
                        <></>
                      )}
                    </View>
                  </View>
                ) : (
                  <View>
                    <SelectBox
                      label=""
                      options={gaurantors.map((item) => {
                        return { id: item.phone, item: item.name };
                      })}
                      value={{
                        id: vehicle.gaurantor.phone,
                        item: vehicle.gaurantor.name,
                      }}
                      onChange={(value: { id: string; item: string }) => {
                        setVehicle({
                          ...vehicle,
                          gaurantor: {
                            name: value.item,
                            phone: value.id,
                          },
                        });
                      }}
                      hideInputFilter={false}
                      listOptionProps={{ nestedScrollEnabled: true }}
                      multiOptionContainerStyle={{
                        backgroundColor: customTheme.colors.headerBackground,
                      }}
                      multiOptionsLabelStyle={{
                        backgroundColor: customTheme.colors.headerBackground,
                      }}
                      arrowIconColor={customTheme.colors.headerBackground}
                      toggleIconColor={customTheme.colors.headerBackground}
                      inputFilterContainerStyle={{ display: "none" }}
                    />
                    <TouchableOpacity
                      className="items-center mt-3"
                      onPress={() => {
                        toggleEdit("isNewGaurantor");
                      }}
                    >
                      <Text>{i18n.t("add_new_guarantor")}</Text>
                    </TouchableOpacity>
                  </View>
                )
              ) : (
                <></>
              )}
            </View>
          </View>
        </ScrollView>
      </ModalBody>
      <ModalFooter>
        <TouchableOpacity
          className="p-3 rounded-md bg-primary"
          onPress={() => {
            let valid = true;
            const _isValid = { ...defaultIsValid };
            if (!vehicle.id.length) {
              _isValid.id = false;
              valid = false;
            }
            if (!vehicle.client.name.length) {
              _isValid.client.name = false;
              valid = false;
            }
            if (!vehicle.client.phone.length) {
              _isValid.client.phone = false;
              valid = false;
            }
            if (edit.isNewGaurantor) {
              if (!vehicle.gaurantor.name.length) {
                _isValid.gaurantor.name = false;
                valid = false;
              }
              if (!vehicle.gaurantor.phone.length) {
                _isValid.gaurantor.phone = false;
                valid = false;
              }
            }
            if (valid) {
              prop.setModalVisible(false);
              setVehicle({ ...defaultVehicle });
              db.addVehicle(vehicle);
            } else {
              console.log(_isValid);
              setIsValid({ ..._isValid });
            }
          }}
        >
          <Text className="text-headerBackground">{i18n.t("add")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3 rounded-md border border-gray-300 mx-2"
          onPress={() => {
            setVehicle({ ...defaultVehicle });
            setIsValid({ ...defaultIsValid });
            prop.setModalVisible(false);
          }}
        >
          <Text className="text-primary">{i18n.t("cancel")}</Text>
        </TouchableOpacity>
      </ModalFooter>
    </CustomModal>
  );
};

export default AddClient;
