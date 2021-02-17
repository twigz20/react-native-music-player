import React, { useMemo } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NavBar from "../components/navbar/NavBar.js";
import SongsScreen from "../screens/SongsScreen.js";
import { shallowEqual, useSelector } from "react-redux";
import { memo } from "react";

const SongsStack = createStackNavigator();

const SongsTab = () => {
  return (
    <SongsStack.Navigator
      initialRouteName="Songs"
      screenOptions={{
        headerTransparent: true,
        header: (props) => <NavBar {...props} />,
      }}
    >
      <SongsStack.Screen name="Songs" component={SongsScreen} />
    </SongsStack.Navigator>
  );
};

export default SongsTab;
