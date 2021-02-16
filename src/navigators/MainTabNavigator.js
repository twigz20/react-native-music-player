/* eslint-disable react/display-name */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";

import HomeTab from "../tabs/HomeTab.js";
import SongsTab from "../tabs/SongsTab.js";

import MiniPlayer from "../components/miniPlayer/MiniPlayer.js";

const MainTab = createBottomTabNavigator();

const MainTabNavigator = () => {
  //   const { colors } = useTheme();

  return (
    <MainTab.Navigator
      tabBar={(tabsProps) => (
        <>
          <MiniPlayer />
          <BottomTabBar {...tabsProps} />
        </>
      )}
      tabBarOptions={{
        // activeTintColor: "red",
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
        component={HomeTab}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="album" color={color} size={26} />
          ),
        }}
      />
      <MainTab.Screen
        name="Artists"
        component={HomeTab}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
      <MainTab.Screen
        name="Playlists"
        component={HomeTab}
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
