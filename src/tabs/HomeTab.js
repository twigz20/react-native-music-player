import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import NavBar from "../components/navbar/NavBar.js";
import HomeScreen from "../screens/HomeScreen.js";
import Page1 from "../screens/Page1.js";
import Page2 from "../screens/Page2.js";

const HomeStack = createStackNavigator();

const HomeTab = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTransparent: true,
        header: (props) => <NavBar {...props} />,
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Page1" component={Page1} />
      <HomeStack.Screen name="Page2" component={Page2} />
    </HomeStack.Navigator>
  );
};

export default HomeTab;
