import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Appbar } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import QueueMenu from "../menus/QueueMenu.js";

const QueueNavBar = () => {
  const navigation = useNavigation();

  return (
    <Appbar.Header
      style={{
        backgroundColor: "transparent",
        borderBottomWidth: 1,
        borderColor: "#9fc8e2",
        height: 45,
      }}
    >
      <TouchableOpacity onPress={navigation.goBack}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={25}
          color="white"
          style={{ marginLeft: 5 }}
        />
      </TouchableOpacity>
      <Appbar.Content title="" />
      <QueueMenu />
    </Appbar.Header>
  );
};

export default QueueNavBar;
