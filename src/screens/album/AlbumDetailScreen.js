import * as React from "react";
import {
  Button,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { DBContext } from "../../contexts/DBContext";
import { Box, Text } from "react-native-design-utility";
import { useNavigation } from "@react-navigation/native";

import BackgroundImage from "../../components/background/BackgroundImage.js";
import { Entypo, MaterialCommunityIcons } from "react-native-vector-icons";

import AlbumDetailTrackItem from "../../components/album/AlbumDetailTrackItem.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTotalMinutes } from "../../utils/helpers";
import { itemPlay, setShuffle } from "../../reducers/Player/actions";
import { useContext } from "react";
import TextTicker from "react-native-text-ticker";

import arrayShuffle from "array-shuffle";

const AlbumDetailScreen = ({ route, navigation }) => {
  const dbContext = useContext(DBContext);
  const tracks = useSelector((state) => state.Library.tracks);
  const dispatch = useDispatch();

  const _play = async () => {
    dispatch(setShuffle(true));
    let randomTrack = arrayShuffle(route.params.album.tracks)[0];
    dispatch(itemPlay(randomTrack, route.params.album.id));
    await dbContext.updatePlayInfo(randomTrack);
  };

  let albumTracks = tracks.filter((track) =>
    route.params.album.tracks.includes(track.id)
  );

  let albumMinutes = 0;
  albumTracks.forEach((track) => {
    albumMinutes += track.duration;
  });
  albumMinutes = getTotalMinutes(albumMinutes);

  return (
    <BackgroundImage>
      <Box f={1} ml={15} mr={15} mt={10}>
        <Box dir="col">
          <Box dir="row">
            <Box mr={15}>
              <Image
                source={{ uri: route.params.album.artwork }}
                style={{ height: 150, width: 150, borderRadius: 10 }}
              />
            </Box>
            <Box f={1} dir="col">
              <TextTicker
                style={{ fontSize: 15, color: "white" }}
                numberOfLines={1}
                duration={5000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
              >
                {route.params.album.name}
              </TextTicker>
              <Text size={12} color="#A0A0A0">
                {route.params.album.artist}
              </Text>
              <Box f={1} dir="row" align="end" justify="end">
                <TouchableOpacity onPress={_play}>
                  <MaterialCommunityIcons
                    name="shuffle"
                    size={25}
                    color="white"
                    style={{ marginRight: 10 }}
                  ></MaterialCommunityIcons>
                </TouchableOpacity>
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={25}
                    color="white"
                  />
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>
          <Box mb={5}>
            <Text right color="white" size={12}>
              {route.params.album.tracks.length} track
              {route.params.album.tracks.length > 0 ? "s" : ""} - {albumMinutes}
            </Text>
          </Box>
        </Box>
        <Box h={2} bg="#A0A0A0"></Box>
        <FlatList
          data={albumTracks}
          keyExtractor={({ id }) => id.toString()}
          renderItem={({ item }) => <AlbumDetailTrackItem track={item} />}
        />
      </Box>
    </BackgroundImage>
  );
};

export default AlbumDetailScreen;
