/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { memo } from "react";
import { Image, StyleSheet } from "react-native";
import { List } from "react-native-paper";
import { Box } from "react-native-design-utility";
import PlaylistItemMenu from "../menus/PlaylistItemMenu.js";
import { useDispatch, useSelector } from "react-redux";

import { useContext } from "react";
import { DBContext } from "../../contexts/DBContext.js";

import PlayListImages from "../../data/playlist_images/index.js";
import { useNavigation } from "@react-navigation/native";
import AddUpdatePlaylistModal from "../modals/AddUpdatePlaylistModal.js";
import { useState } from "react";

const PlaylistItem = memo(({ playlist }) => {
  const dispatch = useDispatch();
  const dbContext = useContext(DBContext);
  const navigator = useNavigation();
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  return (
    <>
      <List.Item
        title={playlist.playlist_id}
        description={`${playlist.tracks.length} Song${
          playlist.tracks.length ? "s" : ""
        }`}
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
              <Image
                source={PlayListImages[playlist.playlist_image_id]}
                style={styles.image_view}
              />
            </Box>
          </Box>
        )}
        right={() => (
          <Box f={1} w={10} align="end" justify="center">
            <PlaylistItemMenu playlist={playlist} showModal={showModal} />
          </Box>
        )}
        onPress={() =>
          navigator.navigate("PlaylistDetails", { playlist: playlist })
        }
      />
      {visible ? (
        <AddUpdatePlaylistModal
          hideModal={hideModal}
          isUpdate={true}
          playlist={playlist}
        />
      ) : null}
    </>
  );
});

const styles = StyleSheet.create({
  image_view: {
    flex: 1,
    width: "100%",
  },
});

export default PlaylistItem;
