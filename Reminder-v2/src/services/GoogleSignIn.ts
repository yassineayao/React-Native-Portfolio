import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { ToastAndroid } from "react-native";
import i18n from "./i18n";

const signIn = async () => {
  try {
    // const hasPlayServices = await GoogleSignin.hasPlayServices({
    //   showPlayServicesUpdateDialog: true,
    // });
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive"], // We want   read and write access
    });
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!isSignedIn) {
      const user = await GoogleSignin.signIn();
      console.log(user);
    }
    return true;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      console.log("sign in cancelled");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
      console.log("in progress ");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
      console.log("play services not available");
    } else {
      // some other error happened
      console.log("some error happened");
    }
    if (error.message === "NETWORK_ERROR")
      ToastAndroid.show(i18n.t("network_error"), ToastAndroid.LONG);
    ToastAndroid.show(i18n.t("signin_error"), ToastAndroid.LONG);
    console.log(error.message);
    return false;
  }
};

export { signIn };
