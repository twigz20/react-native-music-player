import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NavBar from "../components/navbar/NavBar.js";
import AlbumsScreen from "../screens/AlbumsScreen.js";
import Page1 from "../screens/Page1.js";

const HomeStack = createStackNavigator();

const HomeTab = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Albums"
      screenOptions={{
        headerTransparent: true,
        header: (props) => <NavBar {...props} />,
      }}
    >
      <HomeStack.Screen name="Albums" component={AlbumsScreen} />
      <HomeStack.Screen name="Page1" component={Page1} />
    </HomeStack.Navigator>
  );
};

export default HomeTab;
