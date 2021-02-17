import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Menu } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const AlbumItemMenu = ({ navigation, previous }) => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={openMenu}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color="white"
          />
        </TouchableOpacity>
      }
    >
      <Menu.Item
        onPress={() => {
          console.log("Option 1 was pressed");
        }}
        title="Option 1"
      />
      <Menu.Item
        onPress={() => {
          console.log("Option 2 was pressed");
        }}
        title="Option 2"
      />
      <Menu.Item
        onPress={() => {
          console.log("Option 3 was pressed");
        }}
        title="Option 3"
        disabled
      />
    </Menu>
  );
};

export default AlbumItemMenu;
