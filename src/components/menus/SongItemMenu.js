import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Menu } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const SongItemMenu = ({ navigation, previous, showModal, track }) => {
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
          console.log("Add to Queue was pressed");
        }}
        title="Add to Queue"
        titleStyle={{ color: "white" }}
      />
      <Menu.Item
        onPress={() => {
          closeMenu();
          showModal(track);
        }}
        title="Add to Playlist"
        titleStyle={{ color: "white" }}
      />
      <Menu.Item
        onPress={() => {
          console.log("View Album was pressed");
        }}
        title="View Album"
        titleStyle={{ color: "white" }}
      />
      <Menu.Item
        onPress={() => {
          console.log("View Playlist was pressed");
        }}
        title="View Playlist"
        titleStyle={{ color: "white" }}
      />
    </Menu>
  );
};

export default SongItemMenu;
