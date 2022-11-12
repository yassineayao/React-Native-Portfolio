import { StatusBar, Text, View } from "react-native";
import Login from "./src/screens/Login";

export default function App() {
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="default" />
      <Login />
    </View>
  );
}
