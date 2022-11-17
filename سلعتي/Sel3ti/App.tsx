import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar, View } from "react-native";
import BottomTabs from "./src/navigators/BottomTabs";
import { Provider } from "react-redux";
import { Store } from "./src/redux/store";

export default function App() {
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Provider store={Store}>
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      </Provider>
    </View>
  );
}
