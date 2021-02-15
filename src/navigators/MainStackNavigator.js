/* eslint-disable react/display-name */
import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";

import MainTabNavigator from "../navigators/MainTabNavigator.js";
import PlayerScreen from "../components/player/PlayerScreen.js";
import QueueScreen from "../components/queue/QueueScreen.js";

import { setAllPlaylists } from "../reducers/Song/actions";
import { adjustDbTrackInfo } from "../reducers/DB/actions";
import { PlaylistType } from "../constants/constants.js";

const MainStack = createStackNavigator();

const MainStackNavigator = () => {
  const { tracks } = useSelector((state) => state.Song);
  const dispatch = useDispatch();

  useEffect(() => {
    let playlists = {};
    playlists[PlaylistType.ALL] = tracks;
    dispatch(setAllPlaylists(playlists));
    dispatch(adjustDbTrackInfo(tracks));
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
