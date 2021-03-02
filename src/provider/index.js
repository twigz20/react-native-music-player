import React, { useEffect, useContext } from "react";
import { AppState } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import TrackPlayer from "react-native-track-player";
import { DBProvider } from "../contexts/DBContext.js";
import MainStackNavigator from "../navigators/MainStackNavigator.js";
import { NavigationContainer } from "@react-navigation/native";

import * as SplashScreen from "expo-splash-screen";

import store from "./store";

import { updatePlayback, initializePlayback } from "reducers/Player/actions";
import { setTrackList } from "reducers/Library/actions";

import Service from "./service";

export default function withProvider() {
  useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await prepareResources();

        store.dispatch(initializePlayback());

        AppState.addEventListener("change", (appState) => {
          if (appState == "active") {
            store.dispatch(updatePlayback());
          }
        });

        TrackPlayer.registerPlaybackService(() => Service(store.dispatch));
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  const prepareResources = async () => {
    try {
      const response = await fetch("http://192.168.1.113:8161/tracks");
      let tracks = await response.json();
      store.dispatch(setTrackList(tracks));
    } catch (error) {
      console.warn(error);
    }
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
    },
  };

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <DBProvider>
          <NavigationContainer>
            <MainStackNavigator />
          </NavigationContainer>
        </DBProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}
