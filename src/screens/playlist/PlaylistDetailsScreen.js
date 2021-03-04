import React, { useContext } from "react";
import { Box, Text } from "react-native-design-utility";
import { FlatGrid } from "react-native-super-grid";

import { useDispatch, useSelector } from "react-redux";

import BackgroundImage from "../../components/background/BackgroundImage.js";
import { Entypo, MaterialCommunityIcons } from "react-native-vector-icons";

import PlayListImages from "../../data/playlist_images/index.js";
import PlaylistItem from "../../components/playlist/PlaylistItem.js";
import PlaylistDefaultItem from "../../components/playlist/PlaylistDefaultItem.js";
import { getTotalMinutes } from "../../utils/helpers";
import { itemPlay, setShuffle } from "../../reducers/Player/actions";
import { DBContext } from "../../contexts/DBContext.js";
import TextTicker from "react-native-text-ticker";
import arrayShuffle from "array-shuffle";
import { TouchableOpacity, Image, FlatList } from "react-native";
import SongItem from "../../components/song/SongItem.js";

export default function PlaylistDetailsScreen({ route, navigation }) {
  const dbContext = useContext(DBContext);
  const tracks = useSelector((state) => state.Library.tracks);
  const dispatch = useDispatch();

  const playlist = route.params.playlist;

  const _play = async () => {
    dispatch(setShuffle(true));
    let randomTrack = arrayShuffle(playlist.tracks)[0];
    dispatch(itemPlay(randomTrack, playlist.playlist_id));
    await dbContext.updatePlayInfo(randomTrack);
  };

  let playlistTracks = tracks.filter((track) =>
    playlist.tracks.includes(track.id)
  );

  let playlistMinutes = 0;
  playlistTracks.forEach((track) => {
    playlistMinutes += track.duration;
  });
  playlistMinutes = getTotalMinutes(playlistMinutes);

  console.log(playlist);

  return (
    <BackgroundImage>
      <Box f={1} ml={15} mr={15} mt={10}>
        <Box dir="col">
          <Box dir="row">
            <Box mr={15}>
              <Image
                source={PlayListImages[playlist.playlist_image_id]}
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
                {playlist.playlist_id}
              </TextTicker>
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
              {playlist.tracks.length} track
              {playlist.tracks.length > 0 ? "s" : ""} - {playlistMinutes}
            </Text>
          </Box>
        </Box>
        <Box h={2} bg="#A0A0A0"></Box>
        <FlatList
          data={playlistTracks}
          keyExtractor={({ id }) => id.toString()}
          renderItem={({ item }) => (
            <SongItem track={item} playlistId={playlist.playlist_id} />
          )}
        />
      </Box>
    </BackgroundImage>
  );
}
