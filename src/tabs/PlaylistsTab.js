import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NavBar from "../components/navbar/NavBar.js";
import PlaylistsScreen from "../screens/playlist/PlaylistsScreen.js";
import PlaylistDetailsScreen from "../screens/playlist/PlaylistDetailsScreen.js";

const PlaylistStack = createStackNavigator();

const PlaylistTab = () => {
  return (
    <PlaylistStack.Navigator
      initialRouteName="Playlists"
      screenOptions={{
        headerTransparent: true,
        header: (props) => <NavBar {...props} />,
      }}
    >
      <PlaylistStack.Screen name="Playlists" component={PlaylistsScreen} />
      <PlaylistStack.Screen
        name="PlaylistDetails"
        component={PlaylistDetailsScreen}
      />
    </PlaylistStack.Navigator>
  );
};

export default PlaylistTab;
