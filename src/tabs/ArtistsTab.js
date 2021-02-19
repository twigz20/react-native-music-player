import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NavBar from "../components/navbar/NavBar.js";
import ArtistsScreen from "../screens/artist/ArtistsScreen.js";
import ArtistDetailScreen from "../screens/artist/ArtistDetailScreen.js";
import AlbumDetailScreen from "../screens/album/AlbumDetailScreen.js";

const ArtistStack = createStackNavigator();

const ArtistTab = () => {
  return (
    <ArtistStack.Navigator
      initialRouteName="Artists"
      screenOptions={{
        headerTransparent: true,
        header: (props) => <NavBar {...props} />,
      }}
    >
      <ArtistStack.Screen name="Artists" component={ArtistsScreen} />
      <ArtistStack.Screen name="ArtistDetails" component={ArtistDetailScreen} />
      <ArtistStack.Screen name="AlbumDetails" component={AlbumDetailScreen} />
    </ArtistStack.Navigator>
  );
};

export default ArtistTab;
