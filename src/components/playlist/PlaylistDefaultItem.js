import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, ImageBackground, TouchableOpacity } from "react-native";
import { Box, Text } from "react-native-design-utility";
import TextTicker from "react-native-text-ticker";

import { MaterialCommunityIcons, Entypo } from "react-native-vector-icons";

import { theme } from "../../constants/theme.js";
import AlbumItemMenu from "../menus/AlbumItemMenu.js";

import PlayListImages from "../../data/playlist_images/index.js";

export default function PlaylistDefaultItem({ playlist }) {
  const navigator = useNavigation();

  return (
    <Box h={150} w="50%" px="sm" dir="col">
      <TouchableOpacity
        onPress={() =>
          navigator.navigate("PlaylistDetails", { playlist: playlist })
        }
      >
        <Box h={130} radius={10} style={{ overflow: "hidden" }}>
          <ImageBackground
            source={PlayListImages[playlist.playlist_image_id]}
            style={{ flex: 1 }}
          >
            <Box f={1} dir="row" mr={-10} ml={10} mb={10}>
              <Box dir="col" justify="end">
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
                    {playlist.playlist_id}
                  </TextTicker>
                </Box>
                <Box>
                  <Text size={10} color={theme.color.white}>
                    {`${playlist.tracks.length} Song${
                      playlist.tracks.length ? "s" : ""
                    }`}
                  </Text>
                </Box>
              </Box>
              <Box f={1} align="end" justify="end" mr={10}>
                <Entypo name="controller-play" size={30} color="white" />
              </Box>
            </Box>
          </ImageBackground>
        </Box>
      </TouchableOpacity>
    </Box>
  );
}
