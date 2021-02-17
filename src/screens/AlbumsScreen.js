import React from "react";
import { FlatGrid } from "react-native-super-grid";

import { useSelector } from "react-redux";

import BackgroundImage from "../components/background/BackgroundImage.js";

import AlbumItem from "../components/album/AlbumItem.js";

export default function AlbumsScreen() {
  const { albums } = useSelector((state) => state.Library);

  let _albums = Object.entries(albums).map(([key, value]) => {
    value.id = key;
    return value;
  });

  return (
    <BackgroundImage>
      <FlatGrid
        itemDimension={130}
        data={_albums}
        spacing={8}
        renderItem={({ item }) => <AlbumItem album={item} />}
      />
    </BackgroundImage>
  );
}
