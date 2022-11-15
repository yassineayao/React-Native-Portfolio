import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar, View } from "react-native";
import BottomTabs from "./src/navigators/BottomTabs";

export default function App() {
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </View>
  );
}
