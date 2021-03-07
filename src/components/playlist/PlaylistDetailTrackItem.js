import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useContext } from "react";
import { Image, TouchableOpacity } from "react-native";
import { Box, Text } from "react-native-design-utility";
import { List } from "react-native-paper";
import TextTicker from "react-native-text-ticker";

import { MaterialCommunityIcons } from "react-native-vector-icons";
import { useDispatch, useSelector } from "react-redux";

import { theme } from "../../constants/theme.js";
import { itemPlay } from "../../reducers/Player/actions.js";
import { buildTime } from "../../utils/helpers.js";
import SongItemMenu from "../menus/SongItemMenu.js";

export default function AlbumDetailTrackItem({ track }) {
  const navigator = useNavigation();
  const dispatch = useDispatch();
  const currentTrack = useSelector((state) => state.Player.track);

  const _play = async () => {
    dispatch(itemPlay(track.id, `Album-${track.album_id}`));
  };

  const titleColor =
    currentTrack && track.id == currentTrack.id
      ? theme.color.blueShade1
      : "white";

  return (
    <List.Item
      title={track.title}
      description={track.artists + " - " + buildTime(track.duration)}
      titleStyle={{
        color: titleColor,
        fontSize: 15,
      }}
      descriptionStyle={{
        color: "#A0A0A0",
        fontSize: 12,
      }}
      style={{}}
      left={() => (
        <Box mt={5} w={30}>
          <Text size={15} color="#A0A0A0" right>
            {track.track_position}
          </Text>
        </Box>
      )}
      right={() => (
        <Box align="end" justify="center">
          <SongItemMenu />
        </Box>
      )}
      onPress={_play}
    />
  );
}
