import React, { useContext, useState } from "react";
import { Box, Text } from "react-native-design-utility";
import { Modal, Portal, TextInput, Button } from "react-native-paper";

import { useSelector } from "react-redux";

import { MaterialCommunityIcons, Entypo } from "react-native-vector-icons";

import { DBContext } from "../../contexts/DBContext.js";
import {
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { List } from "react-native-paper";
import PlayListImages from "../../data/playlist_images/index.js";
import { theme } from "../../constants/theme.js";
import { useEffect } from "react";

const AddToPlaylistModal = ({ track, hideModal }) => {
  const dbContext = useContext(DBContext);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [playistItems, setPlaylistItems] = useState([]);

  useEffect(() => {
    let _playlistItems = dbContext.playlists.slice(4).map((p) => {
      p.isSelected = false;
      p.selectedIcon = p.isSelected
        ? "checkbox-marked-circle"
        : "checkbox-blank-circle-outline";
      p.selectedColor = p.isSelected ? theme.color.blueShade1 : "white";
      return p;
    });
    setPlaylistItems(_playlistItems);
  }, []);

  const selectItem = (data) => {
    data.isSelected = !data.isSelected;
    data.selectedClass = data.isSelected ? styles.selected : "";
    data.selectedIcon = data.isSelected
      ? "checkbox-marked-circle"
      : "checkbox-blank-circle-outline";
    data.selectedColor = data.isSelected ? theme.color.blueShade1 : "white";

    let _playistItems = [...playistItems];

    const index = _playistItems.findIndex((item) => data.id === item.id);

    _playistItems[index] = data;

    setPlaylistItems(_playistItems);
    setSelectedPlaylists(
      _playistItems.filter((p) => p.isSelected).map((p) => p.playlist_id)
    );
  };

  const renderItem = (playlist) => (
    <List.Item
      title={playlist.playlist_id}
      description={`${playlist.tracks.length} Song${
        playlist.tracks.length ? "s" : ""
      }`}
      titleStyle={{
        color: "white",
        fontSize: 15,
        marginLeft: "-20%",
      }}
      descriptionStyle={{
        color: "#A0A0A0",
        fontSize: 12,
        marginLeft: "-20%",
      }}
      style={{}}
      left={() => (
        <Box f={1} justify="center">
          <Image
            source={PlayListImages[playlist.playlist_image_id]}
            style={{ width: 60, height: 60, borderRadius: 10 }}
          />
        </Box>
      )}
      right={() => (
        <Box f={1} w={10} align="end" justify="center">
          <TouchableOpacity>
            <MaterialCommunityIcons
              name={playlist.selectedIcon}
              size={20}
              color={playlist.selectedColor}
            />
          </TouchableOpacity>
        </Box>
      )}
      onPress={() => selectItem(playlist)}
    />
  );

  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={() => {
          hideModal();
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add to Playlist</Text>
          <List.Item
            title="Create playlist"
            titleStyle={{
              color: "white",
              fontSize: 15,
              marginLeft: "-45%",
            }}
            style={{}}
            left={() => (
              <Box f={1} justify="center">
                <Box
                  w={60}
                  h={60}
                  bg="#3f4554"
                  justify="center"
                  align="center"
                  style={{ borderRadius: 10 }}
                >
                  <MaterialCommunityIcons name="plus" size={30} color="white" />
                </Box>
              </Box>
            )}
            onPress={() => null}
          />
          <FlatList
            data={playistItems}
            keyExtractor={({ id }) => id.toString()}
            renderItem={({ item }) => renderItem(item)}
          />
          <View style={styles.modalActionsContainer}>
            <TouchableOpacity
              onPress={() => {
                hideModal();
              }}
            >
              <Text style={styles.modalActionCancel}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dbContext.addToPlaylist(selectedPlaylists, track.id);
                hideModal();
              }}
            >
              <Text style={styles.modalActionCreate}>ADD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#1f2126",
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 5,
    borderRadius: 10,
  },
  modalTitle: {
    color: "white",
    textAlign: "center",
  },
  modalInputContainer: {
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
  },
  modalActionsContainer: {
    alignSelf: "center",
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
  },
  modalActionCancel: {
    marginRight: 10,
    color: "white",
  },
  modalActionCreate: {
    color: "white",
  },
  selected: { backgroundColor: "#FA7B5F" },
});

export default AddToPlaylistModal;
