import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { Box, Text } from "react-native-design-utility";
import TextTicker from "react-native-text-ticker";

import { MaterialCommunityIcons } from "react-native-vector-icons";

import { theme } from "../../constants/theme.js";
import AlbumItemMenu from "../menus/AlbumItemMenu.js";

export default function PlaylistItem({ album }) {
  const navigator = useNavigation();

  return (
    <Box h={180} px="sm" mt={5} dir="col">
      <TouchableOpacity
        onPress={() => navigator.navigate("AlbumDetails", { album: album })}
      >
        <Box h={130} w={130} radius={10} style={{ overflow: "hidden" }}>
          <Image source={{ uri: album.artwork }} style={{ flex: 1 }} />
        </Box>
      </TouchableOpacity>
      <Box f={1} dir="row" mr={-10} ml={10}>
        <Box dir="col">
          <Box w={100}>
            <TextTicker
              style={{ fontSize: 15, color: theme.color.white }}
              numberOfLines={1}
              duration={15000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
            >
              {album.name}
            </TextTicker>
          </Box>
          <Box>
            <Text size={10} color="#A0A0A0">
              {`${album.tracks.length} Song${album.tracks.length ? "s" : ""}`}
            </Text>
          </Box>
        </Box>
        <Box dir="col" align="end" justify="center">
          <AlbumItemMenu />
        </Box>
      </Box>
    </Box>
  );
}
