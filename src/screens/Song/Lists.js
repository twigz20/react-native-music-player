import React, { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import SongItem from "../../components/song/SongItem.js";

import { getTrackList } from "../../reducers/Song/actions";

import { theme } from "../../constants/theme";
import { PlaylistType } from "../../constants/constants.js";

const List = () => {
  const { tracks, isLoading } = useSelector((state) => state.Song);
  const dispatch = useDispatch();

  const onRefresh = async () => {
    dispatch(getTrackList());
  };

  if (!tracks.length) return null;

  return (
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
  );
};

export default List;
