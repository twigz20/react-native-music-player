import React, { useContext } from "react";
import { Box, Text } from "react-native-design-utility";
import { FlatGrid } from "react-native-super-grid";

import { useSelector } from "react-redux";

import BackgroundImage from "../../components/background/BackgroundImage.js";

import PlaylistItem from "../../components/playlist/PlaylistItem.js";
import PlaylistDefaultItem from "../../components/playlist/PlaylistDefaultItem.js";
import { DBContext } from "../../contexts/DBContext.js";

export default function PlaylistDetailsScreen() {
  const dbContext = useContext(DBContext);

  return (
    <BackgroundImage>
      <Box f={1} dir="row" flexWrap="wrap">
        <Text>PlaylistDetailsScreen</Text>
      </Box>
    </BackgroundImage>
  );
}
