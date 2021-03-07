import React, { useState, useContext } from "react";
import { TouchableOpacity } from "react-native";
import { Menu } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { useDatabase } from "../../contexts/DatabaseContext.js";

const PlaylistItemMenu = ({ playlist, showModal }) => {
  const { clearPlaylist, deletePlaylist } = useDatabase();
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      contentStyle={{ backgroundColor: "#1f2126" }}
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={openMenu}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color="white"
            style={{ marginRight: 0 }}
          />
        </TouchableOpacity>
      }
    >
      <Menu.Item
        onPress={() => {
          console.log("Play next was pressed");
          closeMenu();
        }}
        title="Play next"
        titleStyle={{ color: "white" }}
      />
      <Menu.Item
        onPress={() => {
          console.log("Add to Queue was pressed");
          closeMenu();
        }}
        title="Add to Queue"
        titleStyle={{ color: "white" }}
      />
      <Menu.Item
        onPress={() => {
          console.log("Add to Playlist was pressed");
          closeMenu();
        }}
        title="Add to Playlist"
        titleStyle={{ color: "white" }}
      />
      <Menu.Item
        onPress={() => {
          showModal();
          closeMenu();
        }}
        title="Rename"
        titleStyle={{ color: "white" }}
      />
      <Menu.Item
        onPress={() => {
          // database.updatePlaylistTracks();
          clearPlaylist(playlist.playlist_id);
          closeMenu();
        }}
        title="Clear"
        titleStyle={{ color: "white" }}
      />
      <Menu.Item
        onPress={() => {
          deletePlaylist(playlist.playlist_id);
          closeMenu();
        }}
        title="Delete"
        titleStyle={{ color: "white" }}
      />
    </Menu>
  );
};

export default PlaylistItemMenu;
