import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import BackgroundImage from "../../components/background/BackgroundImage.js";
import SongItem from "../../components/song/SongItem.js";
import List from "./Lists.js";

import { getTrackList } from "../../reducers/Song/actions";

import { theme } from "../../constants/theme";

const YourLibraryScreen = () => {
  return (
    <BackgroundImage>
      <View
        style={{
          flex: 1,
          paddingLeft: 6,
          paddingRight: 6,
          marginTop: 45,
        }}
      >
        <List />
      </View>
    </BackgroundImage>
  );
};

export default YourLibraryScreen;
