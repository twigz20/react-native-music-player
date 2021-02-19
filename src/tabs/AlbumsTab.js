import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NavBar from "../components/navbar/NavBar.js";
import AlbumsScreen from "../screens/album/AlbumsScreen.js";
import AlbumDetailScreen from "../screens/album/AlbumDetailScreen.js";

const AlbumStack = createStackNavigator();

const AlbumTab = () => {
  return (
    <AlbumStack.Navigator
      initialRouteName="Albums"
      screenOptions={{
        headerTransparent: true,
        header: (props) => <NavBar {...props} />,
      }}
    >
      <AlbumStack.Screen name="Albums" component={AlbumsScreen} />
      <AlbumStack.Screen name="AlbumDetails" component={AlbumDetailScreen} />
    </AlbumStack.Navigator>
  );
};

export default AlbumTab;
