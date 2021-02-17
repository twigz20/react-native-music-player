/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { memo } from "react";
import { Image, StyleSheet } from "react-native";
import { List } from "react-native-paper";
import { buildTime } from "../../utils/helpers";
import { Box } from "react-native-design-utility";
import SongItemMenu from "../menus/SongItemMenu.js";
import { useDispatch, useSelector } from "react-redux";

import { itemPlay } from "reducers/Player/actions";
import { theme } from "../../constants/theme";
import { useContext } from "react";
import { DBContext } from "../../contexts/DBContext.js";

const SongItem = memo(({ track, playlistId }) => {
  const dispatch = useDispatch();
  const currentTrack = useSelector((state) => state.Player.track);
  const dbContext = useContext(DBContext);

  const _play = async () => {
    dispatch(itemPlay(track.id, playlistId, false));
    await dbContext.updatePlayInfo(track.id);
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
        marginLeft: "-50%",
      }}
      descriptionStyle={{
        color: "#A0A0A0",
        fontSize: 12,
        marginLeft: "-50%",
      }}
      style={{}}
      left={() => (
        <Box f={1} w={250} justify="center" style={{ overflow: "hidden" }}>
          <Box
            h={60}
            w={60}
            radius={10}
            justify="center"
            style={{ overflow: "hidden" }}
          >
            <Image source={{ uri: track.artwork }} style={styles.image_view} />
          </Box>
        </Box>
      )}
      right={() => (
        <Box f={1} w={10} align="end" justify="center">
          <SongItemMenu />
        </Box>
      )}
      onPress={async () => {
        _play(track.id);
      }}
    />
  );
});

const styles = StyleSheet.create({
  image_view: {
    flex: 1,
    width: "100%",
  },
});

export default SongItem;
