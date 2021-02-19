import React from "react";
import { FlatList, Text } from "react-native";
import { FlatGrid } from "react-native-super-grid";

import { useSelector } from "react-redux";

import BackgroundImage from "../../components/background/BackgroundImage.js";

import ArtistItem from "../../components/artist/ArtistItem.js";

export default function ArtistsScreen() {
  const { artists } = useSelector((state) => state.Library);

  let _artists = Object.entries(artists).map(([key, value]) => {
    value.id = key;
    return value;
  });

  return (
    <BackgroundImage>
      <FlatList
        data={_artists}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item }) => <ArtistItem artist={item} />}
      />
    </BackgroundImage>
  );
}
