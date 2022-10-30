import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Button,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  PencilSquareIcon,
  PaperAirplaneIcon,
  PhoneIcon,
} from "react-native-heroicons/outline";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectBox from "react-native-multi-selectbox";
import { customTheme } from "../constants/theme";
import CardContainer from "../components/CardContainer";
import i18n from "../services/i18n";
import { Gaurantor, Route, Vehicle } from "../types";
import { locale } from "../constants/settings";
import { sharedValues } from "../contexts/SharedValues";

const DetailsScreen = () => {
  const [vehicle, setVehicle] = useState<Vehicle>();
  const [gaurantors, setGaurantors] = useState<Gaurantor[]>([]);
  const [edit, setEdit] = useState({
    type: false,
    client: {
      name: false,
      phone: false,
    },
    deadline: false,
    remain: false,
    gaurantor: {
      isGaurantor: false,
      isNewGaurantor: false,
    },
  });
  const [isValid, setIsValid] = useState({
    client: {
      name: true,
      phone: true,
    },
    gaurantor: {
      name: true,
      phone: true,
    },
  });
  const navigations = useNavigation();
  const context = useContext(sharedValues);
  const route: Route = useRoute();
  useLayoutEffect(() => {
    context.db.getAllGaurantors((gaurantors: Gaurantor[]) => {
      setGaurantors(gaurantors);
    });
    context.db.getVehicle({ id: route.params?.id || "" }, (vehicle: Vehicle) => {
      setVehicle(vehicle);
      navigations.setOptions({
        title: vehicle?.client.name,
        headerRight: () => (
          <TouchableOpacity
            className="mx-2"
            onPress={() => Linking.openURL(`tel:${vehicle?.client.phone}`)}
          >
            <PhoneIcon size={25} color="green" />
          </TouchableOpacity>
        ),
      });
    });
  }, []);

  useEffect(() => {
    if (vehicle) context.db.updateVehicle(vehicle as Vehicle);
  }, [vehicle]);

  const toggleEdit = (
    field: keyof typeof edit | "clientName" | "clientPhone"
  ) => {
    if (field === "clientName") {
      setEdit({ ...edit, client: { ...edit.client, name: !edit.client.name } });
    } else if (field === "clientPhone") {
      setEdit({
        ...edit,
        client: { ...edit.client, phone: !edit.client.phone },
      });
    } else {
      setEdit({ ...edit, [field]: !edit[field] });
    }
  };

  return (
    <ScrollView className="flex-1 pb-20 bg-containerBackground">
      <CardContainer>
        <Text className="font-bold text-3xl text-center">
          {i18n.t("vehicle")}
        </Text>
        <Text>
          {i18n.t("vehicle_id")}: {vehicle?.id}
        </Text>
        <View
          className={`${
            i18n.locale === "ar" ? "flex-row-reverse" : "flex-row"
          } justify-between items-center mt-1`}
        >
          <Text>{i18n.t("type")}</Text>
          {edit.type ? (
            <TextInput
              value={vehicle?.name}
              placeholder="Vehicle type"
              className="text-center border flex-1 mx-4 rounded-full border-gray-400 py-1"
              onChangeText={(value) => {
                setVehicle({ ...vehicle, name: value } as Vehicle);
              }}
            />
          ) : (
            <Text>{vehicle?.name}</Text>
          )}
          <TouchableOpacity
            className="px-2"
            onPress={() => {
              toggleEdit("type");
            }}
          >
            {edit.type ? (
              <PaperAirplaneIcon
                size={20}
                color={customTheme.colors.gray}
                style={{
                  transform: [
                    { rotateY: i18n.locale === "ar" ? "180deg" : "0deg" },
                  ],
                }}
              />
            ) : (
              <PencilSquareIcon
                size={20}
                color={customTheme.colors.gray}
                style={{
                  transform: [
                    { rotateY: i18n.locale === "ar" ? "180deg" : "0deg" },
                  ],
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </CardContainer>

      <CardContainer>
        <Text className="font-bold text-3xl text-center">
          {i18n.t("client")}
        </Text>
        <View className="flex-1">
          <View
            className={`${
              i18n.locale === "ar" ? "flex-row-reverse" : "flex-row"
            } justify-between items-center mt-1`}
          >
            <Text>{i18n.t("name")}</Text>
            {edit.client.name ? (
              <TextInput
                value={vehicle?.client.name}
                placeholder="Vehicle type"
                className="text-center border flex-1 mx-4 rounded-full border-gray-400 py-1"
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
                    client: {
                      ...vehicle?.client,
                      name: value,
                    },
                  } as Vehicle);
                }}
              />
            ) : (
              <Text>{vehicle?.client.name}</Text>
            )}
            <TouchableOpacity
              className="px-2"
              onPress={() => {
                if (isValid.client.name) toggleEdit("clientName");
              }}
            >
              {edit.client.name ? (
                <PaperAirplaneIcon
                  size={20}
                  color={customTheme.colors.gray}
                  style={{
                    transform: [
                      { rotateY: i18n.locale === "ar" ? "180deg" : "0deg" },
                    ],
                  }}
                />
              ) : (
                <PencilSquareIcon
                  size={20}
                  color={customTheme.colors.gray}
                  style={{
                    transform: [
                      { rotateY: i18n.locale === "ar" ? "180deg" : "0deg" },
                    ],
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
          {!isValid.client.name ? (
            <Text className="text-center text-red-500 text-xs pb-2">
              {i18n.t("empty_field_error")}
            </Text>
          ) : (
            <></>
          )}
        </View>

        <View className="flex-1">
          <View
            className={`${
              i18n.locale === "ar" ? "flex-row-reverse" : "flex-row"
            } justify-between items-center mt-1`}
          >
            <Text>{i18n.t("phone")}</Text>
            {edit.client.phone ? (
              <TextInput
                value={vehicle?.client.phone}
                placeholder="Vehicle type"
                className="text-center border flex-1 mx-4 rounded-full border-gray-400 py-1"
                onChangeText={(value) => {
                  // TODO: Check the validation of the phone number
                  setIsValid({
                    ...isValid,
                    client: {
                      ...isValid.client,
                      phone: value.length > 0,
                    },
                  });
                  setVehicle({
                    ...vehicle,
                    client: {
                      ...vehicle?.client,
                      phone: value,
                    },
                  } as Vehicle);
                }}
              />
            ) : (
              <Text>{vehicle?.client.phone}</Text>
            )}
            <TouchableOpacity
              className="px-2"
              onPress={() => {
                if (isValid.client.phone) toggleEdit("clientPhone");
              }}
            >
              {edit.client.phone ? (
                <PaperAirplaneIcon
                  size={20}
                  color={customTheme.colors.gray}
                  style={{
                    transform: [
                      { rotateY: i18n.locale === "ar" ? "180deg" : "0deg" },
                    ],
                  }}
                />
              ) : (
                <PencilSquareIcon
                  size={20}
                  color={customTheme.colors.gray}
                  style={{
                    transform: [
                      { rotateY: i18n.locale === "ar" ? "180deg" : "0deg" },
                    ],
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
          {!isValid.client.phone ? (
            <Text className="text-center text-red-500 text-xs pb-2">
              {i18n.t("phone_error")}
            </Text>
          ) : (
            <></>
          )}
        </View>
      </CardContainer>

      <CardContainer>
        <Text className="font-bold text-3xl text-center">
          {i18n.t("deadline")}
        </Text>
        <View
          className={`${
            i18n.locale === "ar" ? "flex-row-reverse" : "flex-row"
          } justify-between items-center mt-1`}
        >
          <Text>{i18n.t("deadline_date")}</Text>
          {edit.deadline ? (
            <DateTimePicker
              value={vehicle?.deadline || new Date()}
              mode="date"
              onChange={(value) => {
                if (value.type === "dismissed") toggleEdit("deadline");
                else if (value.type === "set") {
                  // TODO: Change time settings
                  toggleEdit("deadline");
                  setVehicle({
                    ...vehicle,
                    deadline: new Date(value.nativeEvent.timestamp || ""),
                  } as Vehicle);
                }
              }}
            />
          ) : (
            <Text>{vehicle?.deadline.toLocaleDateString(locale)}</Text>
          )}
          <TouchableOpacity
            className="px-2"
            onPress={() => {
              toggleEdit("deadline");
            }}
          >
            <PencilSquareIcon
              size={20}
              color={customTheme.colors.gray}
              style={{
                transform: [
                  { rotateY: i18n.locale === "ar" ? "180deg" : "0deg" },
                ],
              }}
            />
          </TouchableOpacity>
        </View>
      </CardContainer>

      <CardContainer>
        <Text className="font-bold text-3xl text-center">
          {i18n.t("pricing")}
        </Text>
        <View
          className={`${
            i18n.locale === "ar" ? "flex-row-reverse" : "flex-row"
          } justify-between items-center mt-1`}
        >
          <Text>{i18n.t("remain")}</Text>
          {edit.remain ? (
            <TextInput
              keyboardType="decimal-pad"
              value={
                vehicle?.payment.price === "0" ? "" : vehicle?.payment.price
              }
              placeholder="0.00"
              className="flex-1 border border-gray-400 rounded-full mx-4 text-center py-1 px-3"
              onChangeText={(value) => {
                setVehicle({
                  ...vehicle,
                  payment: {
                    ...vehicle?.payment,
                    price: value.length > 0 ? value : "0",
                  },
                } as Vehicle);
              }}
            />
          ) : (
            <Text>
              {parseFloat(vehicle?.payment.price.toString() || "0.00").toFixed(
                2
              )}
            </Text>
          )}
          <TouchableOpacity
            className="px-2"
            onPress={() => {
              toggleEdit("remain");
            }}
          >
            {edit.remain ? (
              <PaperAirplaneIcon
                size={20}
                color={customTheme.colors.gray}
                style={{
                  transform: [
                    { rotateY: i18n.locale === "ar" ? "180deg" : "0deg" },
                  ],
                }}
              />
            ) : (
              <PencilSquareIcon
                size={20}
                color={customTheme.colors.gray}
                style={{
                  transform: [
                    { rotateY: i18n.locale === "ar" ? "180deg" : "0deg" },
                  ],
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </CardContainer>

      <CardContainer>
        <Text className="font-bold text-3xl text-center">
          {i18n.t("guarantor")}
        </Text>
        <TouchableOpacity
          className="px-2 absolute left-1 top-7"
          onPress={() => {
            // toggleEdit("gaurantor");
            setEdit({
              ...edit,
              gaurantor: {
                isNewGaurantor: edit.gaurantor.isGaurantor
                  ? false
                  : edit.gaurantor.isNewGaurantor,
                isGaurantor: !edit.gaurantor.isGaurantor,
              },
            });
          }}
        >
          <PencilSquareIcon
            size={20}
            color={customTheme.colors.gray}
            style={{
              transform: [
                { rotateY: i18n.locale === "ar" ? "180deg" : "0deg" },
              ],
            }}
          />
        </TouchableOpacity>
        <View
          className={`${
            i18n.locale === "ar" ? "flex-row-reverse" : "flex-row"
          } justify-between items-center mt-1`}
        ></View>
        <View className="mb-3">
          {edit.gaurantor.isGaurantor ? (
            edit.gaurantor.isNewGaurantor ? (
              <View>
                <View className="mt-2">
                  <Text className="mb-1">
                    {i18n.t("full_name")}
                    <Text className="text-red-600">{"*"}</Text>
                  </Text>
                  <TextInput
                    placeholder={i18n.t("client_name")}
                    className="border border-gray-300 rounded-md p-2"
                    value={vehicle?.gaurantor.name}
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
                        gaurantor: {
                          ...vehicle?.gaurantor,
                          name: value,
                        },
                      } as Vehicle);
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
                    value={vehicle?.gaurantor.phone}
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
                        gaurantor: { ...vehicle?.gaurantor, phone: value },
                      } as Vehicle);
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
                <View className="mt-2">
                  <Button
                    title={i18n.t("add")}
                    color={customTheme.colors.headerBackground}
                    onPress={() => {
                      setIsValid({
                        ...isValid,
                        gaurantor: {
                          name:
                            vehicle && vehicle?.gaurantor.name.length > 0
                              ? true
                              : false,
                          phone:
                            vehicle && vehicle?.gaurantor.phone.length > 0
                              ? true
                              : false,
                        },
                      });
                      if (
                        vehicle?.gaurantor.name.length &&
                        vehicle?.gaurantor.phone.length
                      )
                        context.db.addGaurantor(vehicle?.gaurantor as Gaurantor);
                    }}
                  />
                </View>
              </View>
            ) : (
              <View>
                <SelectBox
                  label=""
                  options={gaurantors.map((item) => {
                    return { item: item.name, id: item.phone };
                  })}
                  value={{
                    id: vehicle?.gaurantor.phone,
                    item: vehicle?.gaurantor.name,
                  }}
                  onChange={(value: { id: string; item: string }) => {
                    setVehicle({
                      ...vehicle,
                      gaurantor: {
                        phone: value.id,
                        name: value.item,
                      },
                    } as Vehicle);
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
                    setEdit({
                      ...edit,
                      gaurantor: {
                        ...edit.gaurantor,
                        isNewGaurantor: !edit.gaurantor.isNewGaurantor,
                      },
                    });
                  }}
                >
                  <Text>{i18n.t("add_new_guarantor")}</Text>
                </TouchableOpacity>
              </View> //
            )
          ) : vehicle && vehicle?.gaurantor.name.length > 0 ? (
            <View className="mt-3">
              <View
                className={`${
                  i18n.locale === "ar" ? "flex-row-reverse" : "flex-row"
                } justify-between items-center mt-1`}
              >
                <Text>{i18n.t("name")}</Text>
                <Text>{vehicle?.gaurantor.name}</Text>
              </View>
              <View
                className={`${
                  i18n.locale === "ar" ? "flex-row-reverse" : "flex-row"
                } justify-between items-center mt-1`}
              >
                <Text>{i18n.t("phone")}</Text>
                <Text>{vehicle?.gaurantor.phone}</Text>
              </View>
            </View>
          ) : (
            <></>
          )}
        </View>
      </CardContainer>
      <View className="items-start p-3">
        <Button
          title={i18n.t("remove")}
          color="red"
          onPress={() => {
            if (vehicle)
              context.db.deleteVehicle(vehicle.id, () => {
                navigations.goBack();
              });
          }}
        />
      </View>
    </ScrollView>
  );
};

export default DetailsScreen;
