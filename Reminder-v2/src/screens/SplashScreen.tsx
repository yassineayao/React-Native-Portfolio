import React, { useLayoutEffect } from "react";
import logo from "../assets/logo.json";
import AnimatedLottieView from "lottie-react-native";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
  const navigations = useNavigation();
  useLayoutEffect(() => {
    navigations.setOptions({ headerShown: false });
  }, []);
  return (
    <SafeAreaView className="justify-center items-center flex-1">
      <AnimatedLottieView
        source={logo as never}
        autoPlay
        loop={false}
        speed={0.3}
        duration={2000}
        hardwareAccelerationAndroid
        onAnimationFinish={() => {
          navigations.navigate("HomeScreen" as never);
        }}
        style={{
          margin: 10,
        }}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;
