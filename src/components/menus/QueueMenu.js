import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Menu } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { useDispatch, useSelector } from "react-redux";
import TrackPlayer from "react-native-track-player";
import { playerReset } from "../../reducers/Player/actions";

const QueueMenu = () => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { playing } = useSelector((state) => state.Player);

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
            style={{ marginRight: 10, marginLeft: 10 }}
          />
        </TouchableOpacity>
      }
    >
      <Menu.Item
        onPress={() => {
          console.log("Save as Playlist was pressed");
        }}
        title="Save as Playlist"
      />
      <Menu.Item
        onPress={() => {
          console.log("Clear playing queue was pressed");
          dispatch(playerReset());
          navigation.navigate("Tabs");
        }}
        title="Clear playing queue"
      />
    </Menu>
  );
};

export default QueueMenu;
