import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Appbar } from "react-native-paper";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import NavBarMenu from "../menus/NavBarMenu.js";

const NavBar = ({ navigation, previous }) => {
  return (
    <Appbar.Header
      style={{
        backgroundColor: "transparent",
        borderBottomWidth: 1,
        borderColor: "#9fc8e2",
        height: 45,
      }}
    >
      {previous ? (
        <Appbar.BackAction
          size={25}
          color="white"
          onPress={navigation.goBack}
        />
      ) : null}
      <TouchableOpacity>
        <MaterialCommunityIcons
          name="menu"
          size={25}
          color="white"
          style={{ marginLeft: 5 }}
        />
      </TouchableOpacity>
      <Appbar.Content title="" />
      <TouchableOpacity>
        <MaterialCommunityIcons name="magnify" size={25} color="white" />
      </TouchableOpacity>
      <NavBarMenu />
    </Appbar.Header>
  );
};

export default NavBar;
