import * as React from "react";
import { Button, Text, View, ImageBackground } from "react-native";
import { DBContext } from "../contexts/DBContext";
import { Box } from "react-native-design-utility";
import { useNavigation } from "@react-navigation/native";

import BackgroundImage from "../components/background/BackgroundImage.js";

const Page1 = () => {
  const navigation = useNavigation();
  const dbContext = React.useContext(DBContext);

  return (
    <BackgroundImage>
      <Box f={1} style={{ marginTop: 50 }} align="center" justify="center">
        <Button
          title="Go to Page 2"
          onPress={() => navigation.navigate("Page2")}
        />

        {dbContext.tracks.map((track) => (
          <Box key={track.seq} bg="white" mb="md" p="sm">
            <Text>{track.title}</Text>
          </Box>
        ))}
      </Box>
    </BackgroundImage>
  );
};

export default Page1;
