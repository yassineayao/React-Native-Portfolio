/**
 * File: Login.js
 * Description: Render and handle the login screen
 */
import React, { useEffect, useState } from "react";
import {
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import {
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
} from "react-native-heroicons/outline";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Svg, { Circle, ClipPath, Image } from "react-native-svg";
import { DomainName } from "../constants/settings";
import { COLORS, SIZES } from "../constants/Theme";
import i18n from "../locales/i18n";
import { TResponse } from "../types";
import { getUser } from "../data/server";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("0676197899");
  const [password, setPassword] = useState("yassine/*-1989");
  const [isValide, setIsValid] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  // Controls settings
  const [showPassword, setShowPassword] = useState(false);
  const adaptedHeight = (SIZES.height * 2) / 3;

  useEffect(() => {
    AsyncStorage.getItem("user", (e, v) => {
      if (v) {
        navigation.navigate("Home" as never);
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handlePhoneNumber = (phoneNum: string) => {
    setPhoneNumber(phoneNum);
  };

  const handleLogin = (phone: string, password: string) => {
    // TODO: move this to server file
    setLoading(true);
    fetch(DomainName + "/auth-jwt/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phone, password: password }),
    })
      .then(async (res: Response) => {
        if (res.status >= 200 && res.status <= 299) {
          const _res: TResponse = await res.json();
          AsyncStorage.setItem("token", _res.token);
          getUser((info) => {
            AsyncStorage.setItem("user", JSON.stringify(info.user));
          });
          navigation.navigate("Home" as never);
        } else {
          setLoading(false);
          const msg = await res.json();
          for (const field in msg) {
            if (field === "non_field_errors")
              if (
                msg[field].includes(
                  "Unable to log in with provided credentials."
                )
              ) {
                // Trow wrong creadentials error
                throw Error(i18n.t("login_wrong_credentials"));
              }
          }
          // In other case throw an empty error
          // This error will be traited as missing of internet connection.
          throw Error();
        }
      })
      .catch((err) => {
        console.log(err);
        // TODO: Add toast messages
      });
  };

  if (loading) {
    return (
      <ActivityIndicator
        size={100}
        color={COLORS.primary}
        className="flex-1 justify-center align-center bg-white"
      />
    );
  }

  const SafeClipPath = ClipPath as unknown as React.FunctionComponent<any>;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: "flex-end",
      }}
    >
      <StatusBar hidden />
      <View className="flex-1">
        <Svg width={SIZES.width} height={adaptedHeight}>
          <SafeClipPath id="clip">
            <Circle r={adaptedHeight} cx={SIZES.width / 2} />
          </SafeClipPath>
          <Image
            href={require("../images/store.jpg")}
            width={SIZES.width}
            height={adaptedHeight}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clip)"
          />
        </Svg>
      </View>
      <View className="">
        <View className="flex-row justify-center items-center">
          <TextInput
            keyboardType="number-pad"
            placeholder={i18n.t("login_phone_number_input")}
            className={`
            flex-1
            justify-center
            items-center
            bg-white
            h-[60]
            p-2
            m-2
            border-b
            border-b-gray-400
          `}
            value={phoneNumber}
            onChangeText={(phone) => handlePhoneNumber(phone)}
          />
          <View className="absolute justify-center items-center right-2">
            <PhoneIcon color="black" size={30} />
          </View>
        </View>
        <View className="flex-row justify-center items-center">
          <TextInput
            placeholder={i18n.t("login_password_input")}
            className={`
              flex-1
              justify-center
              items-center
              bg-white
              h-[60]
              p-2
              m-2
              border-b
              border-b-gray-400
            `}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            className="absolute right-2"
            onPress={() => {
              setShowPassword((value) => !value);
            }}
          >
            {showPassword ? (
              <EyeIcon color={"black"} size={30} />
            ) : (
              <EyeSlashIcon color={"black"} size={30} />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="border border-gray-400 mx-1 rounded-lg justify-center items-center my-2"
          disabled={
            phoneNumber.length === 0 || password.length === 0 || !isValide
          }
          onPress={() => handleLogin(phoneNumber, password)}
        >
          <Text
            className={`text-center p-2 font-bold text-lg ${
              phoneNumber.length === 0 || password.length === 0 || !isValide
                ? "text-gray-400"
                : "text-black"
            }`}
          >
            {i18n.t("login_signin_btn")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
