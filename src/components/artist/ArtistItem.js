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
import { useNavigation } from "@react-navigation/native";

const ArtistItem = memo(({ artist }) => {
  const navigator = useNavigation();

  return (
    <List.Item
      title={artist.name}
      description={
        artist.albums.length +
        (artist.albums.length > 1 ? " Albums" : " Album") +
        " - " +
        artist.trackCount +
        (artist.trackCount > 1 ? " Songs" : " Song")
      }
      titleStyle={{
        color: "white",
        fontSize: 15,
        marginLeft: "-45%",
      }}
      descriptionStyle={{
        color: "#A0A0A0",
        fontSize: 12,
        marginLeft: "-45%",
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
            <Image source={{ uri: artist.artwork }} style={styles.image_view} />
          </Box>
        </Box>
      )}
      right={() => (
        <Box f={1} w={10} align="end" justify="center">
          <SongItemMenu />
        </Box>
      )}
      onPress={() => navigator.navigate("ArtistDetails", { artist: artist })}
    />
  );
});

const styles = StyleSheet.create({
  image_view: {
    flex: 1,
    width: "100%",
  },
});

export default ArtistItem;
