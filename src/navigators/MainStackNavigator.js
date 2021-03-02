/* eslint-disable react/display-name */
import React, { useEffect, useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";

import MainTabNavigator from "../navigators/MainTabNavigator.js";
import PlayerScreen from "../components/player/PlayerScreen.js";
import QueueScreen from "../screens/queue/QueueScreen.js";
import { DBContext } from "../contexts/DBContext.js";

import * as SplashScreen from "expo-splash-screen";

const MainStack = createStackNavigator();

const MainStackNavigator = () => {
  const { dbInit, playlists } = useSelector((state) => state.Library);
  const dbContext = useContext(DBContext);

  useEffect(() => {
    (async () => {
      console.log("DB: ", dbInit);

      if (dbInit) {
        // console.log(dbContext.playlists);
        // console.log(playlists);
        await SplashScreen.hideAsync();
      }
    })();
  }, [dbInit]);

  return (
    <MainStack.Navigator headerMode="none" mode="modal">
      <MainStack.Screen name="Tabs" component={MainTabNavigator} />
      <MainStack.Screen name="Player" component={PlayerScreen} />
      <MainStack.Screen name="Queue" component={QueueScreen} />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
