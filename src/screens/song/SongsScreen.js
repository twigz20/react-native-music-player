import React from "react";
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
} from "react-native";
import { Box } from "react-native-design-utility";
import { useDispatch, useSelector } from "react-redux";

import BackgroundImage from "../../components/background/BackgroundImage.js";
import SongItem from "../../components/song/SongItem.js";
import { PlaylistType } from "../../constants/constants.js";
import { theme } from "../../constants/theme.js";
import { getTrackList } from "../../reducers/Library/index.js";

const SongsScreen = () => {
  const { isLoading, tracks } = useSelector((state) => state.Library);
  const dispatch = useDispatch();

  const onRefresh = async () => {
    dispatch(getTrackList());
  };

  return (
    <BackgroundImage>
      {isLoading ? (
        <ActivityIndicator animating={true} color={theme.color.blueShade1} />
      ) : (
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
      )}
    </BackgroundImage>
  );
};

export default SongsScreen;
