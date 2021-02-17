import React from "react";
import { AppState } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import TrackPlayer from "react-native-track-player";
import { DBProvider } from "../contexts/DBContext.js";
import MainStackNavigator from "../navigators/MainStackNavigator.js";
import { NavigationContainer } from "@react-navigation/native";

import store from "./store";

import { updatePlayback, initializePlayback } from "reducers/Player/actions";

import Service from "./service";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

export default function withProvider() {
  store.dispatch(initializePlayback());

  AppState.addEventListener("change", (appState) => {
    if (appState == "active") {
      store.dispatch(updatePlayback());
    }
  });

  TrackPlayer.registerPlaybackService(() => Service(store.dispatch));

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
