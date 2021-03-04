import React, { useContext, useState } from "react";
import { Box, Text } from "react-native-design-utility";
import { Modal, Portal, TextInput, Button } from "react-native-paper";

import { useSelector } from "react-redux";

import { MaterialCommunityIcons, Entypo } from "react-native-vector-icons";

import BackgroundImage from "../../components/background/BackgroundImage.js";

import PlaylistItem from "../../components/playlist/PlaylistItem.js";
import PlaylistDefaultItem from "../../components/playlist/PlaylistDefaultItem.js";
import { DBContext } from "../../contexts/DBContext.js";
import { FlatList, TouchableOpacity, View, StyleSheet } from "react-native";
import AddUpdatePlaylistModal from "../../components/modals/AddUpdatePlaylistModal.js";

export default function PlaylistsScreen() {
  const dbContext = useContext(DBContext);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  return (
    <BackgroundImage>
      <Box f={1} dir="row" flexWrap="wrap">
        {dbContext.playlists.slice(0, 4).map((playlist, key) => (
          <PlaylistDefaultItem
            key={key}
            playlist={playlist}
            style={{ flexBasis: "50%" }}
          />
        ))}
      </Box>
      <Box f={1} mt={-150} ml={10} mr={10} dir="col">
        <Box dir="row">
          <Text ml={6} size={25} color="white">
            Playlists
          </Text>
          <Box f={1} mr={5} align="end" justify="center">
            <TouchableOpacity
              onPress={() => {
                showModal();
              }}
            >
              <Entypo name="plus" size={30} color="white" />
            </TouchableOpacity>
          </Box>
        </Box>
        <FlatList
          data={dbContext.playlists.slice(4)}
          keyExtractor={({ id }) => id.toString()}
          renderItem={({ item }) => (
            <PlaylistItem playlist={item} showModal={showModal} />
          )}
        />
      </Box>
      {visible ? <AddUpdatePlaylistModal hideModal={hideModal} /> : null}
    </BackgroundImage>
  );
}
