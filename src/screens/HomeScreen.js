import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { Box } from "react-native-design-utility";
import { Button, Text, View, ImageBackground } from "react-native";

import BackgroundImage from "../components/background/BackgroundImage.js";

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <BackgroundImage>
      <Box f={1} mt={55} align="center" justify="center">
        <Text>Home screen</Text>
        <Button
          title="Go to Page 1"
          onPress={() => navigation.navigate("Page1")}
        />
      </Box>
    </BackgroundImage>
  );
};

export default HomeScreen;
