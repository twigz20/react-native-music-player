import * as React from "react";
import { Text, View } from "react-native";
import BackgroundImage from "../components/background/BackgroundImage.js";

const HomeScreen = () => {
  return (
    <BackgroundImage>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Page 2</Text>
      </View>
    </BackgroundImage>
  );
};

export default HomeScreen;
