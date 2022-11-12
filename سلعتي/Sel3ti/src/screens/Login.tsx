/**
 * File: Login.js
 * Description: Render and handle the login screen
 */
import React, { useState } from "react";
import {
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  PhoneIcon,
  EyeIcon,
  EyeSlashIcon,
} from "react-native-heroicons/outline";

import Svg, { Circle, ClipPath, Image } from "react-native-svg";
import { COLORS, SIZES } from "../constants/Theme";
import i18n from "../locales/i18n";

export default function Login() {
  /**
   * render the login screen
   * @param navigation used to navigate between screens
   */
  // Credentials
  const [phoneNumber, setPhoneNumber] = useState("0676197899");
  const [password, setPassword] = useState("yassine/*-1989");
  const [isValide, setIsValid] = useState(true);

  // Controls settings
  const [showPassword, setShowPassword] = useState(false);
  const adaptedHeight = (SIZES.height * 2) / 3;

  // const { signIn } = useContext(AuthContext);

  const handlePhoneNumber = (phoneNum: string) => {
    setPhoneNumber(phoneNum);
  };

  const handleLogin = (phone: string, password: string) => {
    // signIn(phone, password, navigation);
  };

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
          <ClipPath id="clip">
            <Circle r={adaptedHeight} cx={SIZES.width / 2} />
          </ClipPath>
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
            // errorMessage={isValide ? "" : "Invalide Number"}
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
            // errorMessage={isValide ? "" : "Invalide Number"}
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
