/* eslint-disable react/display-name */
import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";

import MainTabNavigator from "../navigators/MainTabNavigator.js";
import PlayerScreen from "../components/player/PlayerScreen.js";
import QueueScreen from "../screens/QueueScreen.js";

import { setAllPlaylists } from "../reducers/Library/actions";
import { PlaylistType } from "../constants/constants.js";

const MainStack = createStackNavigator();

const MainStackNavigator = () => {
  const { tracks } = useSelector((state) => state.Library);
  const dispatch = useDispatch();

  useEffect(() => {
    let playlists = {};
    playlists[PlaylistType.ALL] = tracks.map((t) => t.id);
    dispatch(setAllPlaylists(playlists));
  }, [tracks]);

  return (
    <MainStack.Navigator headerMode="none" mode="modal">
      <MainStack.Screen name="Tabs" component={MainTabNavigator} />
      <MainStack.Screen name="Player" component={PlayerScreen} />
      <MainStack.Screen name="Queue" component={QueueScreen} />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
