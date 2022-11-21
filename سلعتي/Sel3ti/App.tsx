import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar, View } from "react-native";
import { Provider } from "react-redux";
import { Store } from "./src/redux/store";
import StackNavigator from "./src/navigators/StackNavigator";

export default function App() {
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Provider store={Store}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </Provider>
    </View>
  );
}
