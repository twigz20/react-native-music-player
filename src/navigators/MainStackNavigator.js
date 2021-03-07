/* eslint-disable react/display-name */
import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import MainTabNavigator from "../navigators/MainTabNavigator.js";
import PlayerScreen from "../screens/player/PlayerScreen.js";
import QueueScreen from "../screens/queue/QueueScreen.js";

import * as SplashScreen from "expo-splash-screen";

const MainStack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <MainStack.Navigator headerMode="none" mode="modal">
      <MainStack.Screen name="Tabs" component={MainTabNavigator} />
      <MainStack.Screen name="Player" component={PlayerScreen} />
      <MainStack.Screen name="Queue" component={QueueScreen} />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
