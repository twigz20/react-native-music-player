import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { Box } from "react-native-design-utility";
import { useDispatch, useSelector } from "react-redux";

import BackgroundImage from "../components/background/BackgroundImage.js";
import SongItem from "../components/song/SongItem.js";
import { PlaylistType } from "../constants/constants.js";
import { getTrackList } from "../reducers/Library/index.js";

const YourLibraryScreen = () => {
  const { tracks, isLoading } = useSelector((state) => state.Library);
  const dispatch = useDispatch();

  const onRefresh = async () => {
    dispatch(getTrackList());
  };

  if (!tracks.length) return null;

  return (
    <BackgroundImage>
      <Box pl={6} pr={6}>
        <FlatList
          data={tracks}
          keyExtractor={({ id }) => id.toString()}
          renderItem={({ item }) => (
            <SongItem track={item} playlistId={PlaylistType.ALL} />
          )}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
        />
      </Box>
    </BackgroundImage>
  );
};

export default YourLibraryScreen;
