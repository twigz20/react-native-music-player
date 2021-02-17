import React from "react";
import { Image, TouchableOpacity } from "react-native";
import { Box, Text } from "react-native-design-utility";
import TextTicker from "react-native-text-ticker";

import { MaterialCommunityIcons } from "react-native-vector-icons";

import { theme } from "../../constants/theme.js";
import AlbumItemMenu from "../menus/AlbumItemMenu.js";

export default function AlbumItem({ album }) {
  return (
    <Box h={220} px="sm" mt={5}>
      <TouchableOpacity style={{ flex: 1 }}>
        <Box dir="col" align="center" justify="between">
          <Box h="90%" w="125%" radius={10} style={{ overflow: "hidden" }}>
            <Image source={{ uri: album.artwork }} style={{ flex: 1 }} />
          </Box>
        </Box>
      </TouchableOpacity>
      <Box dir="row" mt={-35}>
        <Box f={3} dir="col" ml={-10}>
          <Box dir="row">
            <Box>
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
          </Box>
          <Text size={10} color="#A0A0A0">
            {`${album.tracks.length} Song${album.tracks.length ? "s" : ""}`}
          </Text>
        </Box>
        <Box f={1} dir="col" align="end" justify="center" mr={-15}>
          <AlbumItemMenu />
        </Box>
      </Box>
    </Box>
  );
}
