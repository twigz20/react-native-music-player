/* eslint-disable react/display-name */
import React from "react";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import HomeTab from "../tabs/HomeTab.js";
import AlbumsTab from "../tabs/AlbumsTab.js";
import SongsTab from "../tabs/SongsTab.js";
import ArtistsTab from "../tabs/ArtistsTab.js";
import PlaylistsTab from "../tabs/PlaylistsTab.js";

import MiniPlayer from "../components/miniPlayer/MiniPlayer.js";

const MainTab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <MainTab.Navigator
      tabBar={(tabsProps) => (
        <>
          <MiniPlayer />
          <BottomTabBar {...tabsProps} />
        </>
      )}
      tabBarOptions={{
        style: {
          backgroundColor: "#1f2126",
          borderTopColor: "transparent",
        },
      }}
    >
      <MainTab.Screen
        name="Songs"
        component={SongsTab}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="music-circle"
              color={color}
              size={26}
            />
          ),
        }}
      />

      <MainTab.Screen
        name="Albums"
        component={AlbumsTab}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="album" color={color} size={26} />
          ),
        }}
      />
      <MainTab.Screen
        name="Artists"
        component={ArtistsTab}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
      <MainTab.Screen
        name="Playlists"
        component={PlaylistsTab}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="music-box-multiple"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <MainTab.Screen
        name="Folders"
        component={HomeTab}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="folder" color={color} size={26} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};

export default MainTabNavigator;
