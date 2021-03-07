/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { memo, PureComponent } from "react";
import { Image, StyleSheet } from "react-native";
import { List } from "react-native-paper";
import { buildTime } from "../../utils/helpers";
import { Box } from "react-native-design-utility";
import SongItemMenu from "../menus/SongItemMenu.js";
import { useDispatch, useSelector } from "react-redux";

import { itemPlay } from "reducers/Player/actions";
import { theme } from "../../constants/theme";
import { useContext } from "react";
import AddToPlaylistModal from "../modals/AddToPlaylistModal";
import { useState } from "react";

class SongItem2 extends PureComponent {
  constructor() {
    super();

    this.state = {};
  }
}

const SongItem = memo(({ track, playlistId }) => {
  const dispatch = useDispatch();
  const currentTrack = useSelector((state) => state.Player.track);
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const _play = async () => {
    dispatch(itemPlay(track.id, playlistId));
  };

  const { titleStyle } = styles;
  let _titleStyle = { ...titleStyle };
  let titleColor = _titleStyle.color;
  if (currentTrack && track.id == currentTrack.id) {
    titleColor = theme.color.blueShade1;
  }
  _titleStyle.color = titleColor;
  const combineStyles = StyleSheet.flatten([titleStyle, _titleStyle]);

  console.log("SongItem");

  return (
    <>
      <List.Item
        title={track.title}
        description={track.artists + " - " + buildTime(track.duration)}
        // titleStyle={combineStyles}
        // descriptionStyle={styles.descriptionStyle}
        left={
          () => null
          // <Box justify="center" align="center">
          // <Image source={{ uri: track.artwork }} style={styles.album} />
          // </Box>
        }
        right={
          () => null
          // <Box f={1} w={10} align="end" justify="center">
          //   <SongItemMenu showModal={showModal} track={track} />
          // </Box>
        }
        onPress={_play}
      />
      {/* {visible ? (
        <AddToPlaylistModal hideModal={hideModal} track={track} />
      ) : null} */}
    </>
  );
});

const styles = StyleSheet.create({
  album: {
    flex: 1,
    borderRadius: 10,
    width: 60,
  },
  titleStyle: {
    color: theme.color.white,
    fontSize: 15,
  },
  descriptionStyle: {
    color: "#A0A0A0",
    fontSize: 12,
  },
});

export default SongItem;
