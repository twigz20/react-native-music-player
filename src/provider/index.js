import React, { useEffect, useContext, Component } from "react";
import { AppState, StyleSheet, SafeAreaView, Text } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import TrackPlayer from "react-native-track-player";
import MainStackNavigator from "../navigators/MainStackNavigator.js";
import { NavigationContainer } from "@react-navigation/native";

import * as SplashScreen from "expo-splash-screen";

import store from "./store";

import { updatePlayback, initializePlayback } from "reducers/Player/actions";
import { setTrackList } from "reducers/Library/actions";

import Service from "./service";

import { database } from "../database";
import { DatabaseProvider } from "../contexts/DatabaseContext.js";

export default class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      databaseIsReady: false,
      init: false,
    };
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  async componentDidMount() {
    // App is starting up
    this.appIsNowRunningInForeground();
    this.setState({
      appState: "active",
    });
    // Listen for app state changes
    AppState.addEventListener("change", this.handleAppStateChange);

    await SplashScreen.preventAutoHideAsync();

    store.dispatch(initializePlayback());

    TrackPlayer.registerPlaybackService(() => Service(store.dispatch));
  }

  componentWillUnmount() {
    // Remove app state change listener
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  render() {
    // Once the database is ready, show the Lists
    if (this.state.databaseIsReady) {
      const theme = {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: "#0099ff",
        },
      };

      return (
        <ReduxProvider store={store}>
          <DatabaseProvider>
            <PaperProvider theme={theme}>
              <NavigationContainer>
                <MainStackNavigator />
              </NavigationContainer>
            </PaperProvider>
          </DatabaseProvider>
        </ReduxProvider>
      );
    }
    // Else, show nothing. TODO: show a loading spinner
    return null;
  }

  // Handle the app going from foreground to background, and vice versa.
  handleAppStateChange(nextAppState) {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // App has moved from the background (or inactive) into the foreground
      this.appIsNowRunningInForeground();
      store.dispatch(updatePlayback());
    } else if (
      this.state.appState === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      // App has moved from the foreground into the background (or become inactive)
      this.appHasGoneToTheBackground();
    }
    this.setState({ appState: nextAppState });
  }

  // Code to run when app is brought to the foreground
  async appIsNowRunningInForeground() {
    console.log("App is now running in the foreground!");
    return database.open().then(async () => {
      if (!this.state.init) {
        await this.prepareResources();
        await SplashScreen.hideAsync();
      }
      this.setState({
        databaseIsReady: true,
        init: true,
      });
    });
  }

  // Code to run when app is sent to the background
  appHasGoneToTheBackground() {
    console.log("App has gone to the background.");
    database.close();
  }

  async prepareResources() {
    try {
      const response = await fetch("http://192.168.1.113:8161/tracks?limit=1");
      let tracks = await response.json();

      await database.initTracksInfo(tracks);

      let tracksInfo = await database.getTracksInfo();

      tracks.forEach((track) => {
        let trackInfo = tracksInfo.find((tI) => tI.track_id == track.id);
        track.favourite = trackInfo.favourite;
      });

      store.dispatch(setTrackList(tracks));

      await database.initPlaylistInfo(tracksInfo);
    } catch (error) {
      console.warn(error);
    }
  }
}
