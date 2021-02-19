import * as React from "react";
import {
  Button,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { DBContext } from "../../contexts/DBContext";
import { Box, Text } from "react-native-design-utility";
import { useNavigation } from "@react-navigation/native";

import BackgroundImage from "../../components/background/BackgroundImage.js";
import backgroundImage from "../../components/background/assets/background.jpg";
import { Entypo, MaterialCommunityIcons } from "react-native-vector-icons";

import AlbumDetailTrackItem from "../../components/album/AlbumDetailTrackItem.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTotalMinutes } from "../../utils/helpers";
import { itemPlay, setShuffle } from "../../reducers/Player/actions";
import { useContext } from "react";
import TextTicker from "react-native-text-ticker";

import arrayShuffle from "array-shuffle";
import AlbumItem from "../../components/album/AlbumItem";
import SongItem from "../../components/song/SongItem";
import { PlaylistType } from "../../constants/constants";

const ArtistDetailScreen = ({ route, navigation }) => {
  const dbContext = useContext(DBContext);
  const tracks = useSelector((state) => state.Library.tracks);
  const albums = useSelector((state) => state.Library.albums);

  let _albums = Object.entries(albums)
    .map(([key, value]) => {
      value.id = key;
      return value;
    })
    .filter((album) => route.params.artist.albums.includes(parseInt(album.id)));

  let _tracks = Object.entries(tracks)
    .map(([key, value]) => {
      return value;
    })
    .filter((track) => route.params.artist.id == track.artist_id);

  const dispatch = useDispatch();

  const _play = async () => {
    dispatch(setShuffle(true));
    let randomTrack = arrayShuffle(route.params.album.tracks)[0];
    dispatch(itemPlay(randomTrack, route.params.album.id));
    await dbContext.updatePlayInfo(randomTrack);
  };

  // let albumTracks = tracks.filter((track) =>
  //   route.params.album.tracks.includes(track.id)
  // );

  // let albumMinutes = 0;
  // albumTracks.forEach((track) => {
  //   albumMinutes += track.duration;
  // });
  // albumMinutes = getTotalMinutes(albumMinutes);

  return (
    <BackgroundImage>
      <ScrollView>
        <Box f={1} ml={15} mr={15} mt={10}>
          <Box dir="col">
            <Box dir="row">
              <Box mr={15}>
                <Image
                  source={{ uri: route.params.artist.artwork }}
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
                  {route.params.artist.name}
                </TextTicker>
                <Text size={12} color="#A0A0A0">
                  {route.params.artist.albums.length +
                    (route.params.artist.albums.length > 1
                      ? " Albums"
                      : " Album") +
                    " - " +
                    route.params.artist.trackCount +
                    (route.params.artist.trackCount > 1 ? " Songs" : " Song")}
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
          </Box>
          <Box>
            <Box mt={5}>
              <Text color="white" size="lg" bold>
                Albums
              </Text>
            </Box>
            <Box ml={-15}>
              <FlatList
                data={_albums}
                horizontal={true}
                keyExtractor={({ id }) => id.toString()}
                renderItem={({ item }) => <AlbumItem album={item} />}
              />
            </Box>
          </Box>
          <Box>
            <Box mt={5}>
              <Text color="white" size="lg" bold>
                Songs
              </Text>
            </Box>
            <Box>
              {_tracks.map((track, key) => (
                <SongItem track={track} playlistId={PlaylistType.ALL} />
              ))}
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </BackgroundImage>
  );
};

export default ArtistDetailScreen;
