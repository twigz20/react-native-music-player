import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NavBar from "../components/navbar/NavBar.js";
import SongsScreen from "../screens/Song/SongsScreen.js";

const YourLibraryStack = createStackNavigator();

const YourLibraryTab = () => {
  return (
    <YourLibraryStack.Navigator
      initialRouteName="Songs"
      screenOptions={{
        headerTransparent: true,
        header: (props) => <NavBar {...props} />,
      }}
    >
      <YourLibraryStack.Screen name="Songs" component={SongsScreen} />
    </YourLibraryStack.Navigator>
  );
};

export default YourLibraryTab;
