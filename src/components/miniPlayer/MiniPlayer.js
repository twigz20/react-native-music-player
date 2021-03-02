import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { TouchableOpacity, Image } from "react-native";
import { Box, Text } from "react-native-design-utility";
import {
  useTrackPlayerEvents,
  TrackPlayerEvents,
  STATE_PAUSED,
  STATE_PLAYING,
  STATE_STOPPED,
} from "react-native-track-player";
import Icon from "react-native-vector-icons/Feather";
import { Entypo, MaterialCommunityIcons } from "react-native-vector-icons";

import ProgressSlider from "./ProgressSlider.js";

import { theme } from "../../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import { setUserPlaying } from "../../reducers/Player/actions";
import { DBContext } from "../../contexts/DBContext.js";
import TextTicker from "react-native-text-ticker";

// Subscribing to the following events inside MiniPlayer
const events = [
  TrackPlayerEvents.PLAYBACK_STATE,
  TrackPlayerEvents.PLAYBACK_ERROR,
];

export default function MiniPlayer() {
  const dispatch = useDispatch();
  const dbContext = useContext(DBContext);
  const [state, setState] = useState(TrackPlayerEvents.STATE_PLAYING);
  const { track, playing } = useSelector((state) => state.Player);
  const [isFavourite, setFavourite] = useState(false);

  useTrackPlayerEvents(events, (event) => {
    if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
      console.warn("An error occurred while playing the current track.");
    }
    if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
      setState(event.state);
    }
  });

  useEffect(() => {
    if (track) {
      let trackInfo = dbContext.getTrackInfo(track.id);
      setFavourite(trackInfo.favourite == 1);
    }
  }, [track]);

  const onFavourite = async () => {
    let trackInfo = dbContext.getTrackInfo(track.id);
    let fav = trackInfo.favourite == 0 ? 1 : 0;
    await dbContext.favTrack(track.id, fav);
    setFavourite(fav == 1);
  };

  const onClickPlayPause = () => {
    dispatch(setUserPlaying(!playing));
  };

  const navigation = useNavigation();

  return (
    <>
      {track != null ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Player");
          }}
        >
          <Box
            h={60}
            px="sm"
            style={{
              backgroundColor: "rgba(31, 33, 38,0.975)",
            }}
          >
            <Box f={1} dir="row" align="center" justify="between">
              <Box
                h={45}
                w={45}
                bg="blueLight"
                radius={10}
                mr={10}
                style={{ overflow: "hidden" }}
              >
                <Image source={{ uri: track.artwork }} style={{ flex: 1 }} />
              </Box>
              <Box f={1} mr={20}>
                <TextTicker
                  style={{ fontSize: 12, color: theme.color.blueShade1 }}
                  numberOfLines={1}
                  duration={15000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={1000}
                >
                  {track.title}
                </TextTicker>
                <Text numberOfLines={1} size={8} color={theme.color.blueShade1}>
                  {track.artists}
                </Text>
              </Box>
              <Box mr={10}>
                <TouchableOpacity onPress={onFavourite}>
                  <MaterialCommunityIcons
                    name={isFavourite ? "heart" : "heart-outline"}
                    size={30}
                    color={theme.color.blueShade1}
                  />
                </TouchableOpacity>
              </Box>
              <Box>
                {state == STATE_PAUSED && (
                  <TouchableOpacity onPress={onClickPlayPause}>
                    <Entypo
                      name="controller-play"
                      size={30}
                      color={theme.color.blueShade1}
                    />
                  </TouchableOpacity>
                )}

                {state == STATE_PLAYING && (
                  <TouchableOpacity onPress={onClickPlayPause}>
                    <Entypo
                      name="controller-paus"
                      size={30}
                      color={theme.color.blueShade1}
                    />
                  </TouchableOpacity>
                )}

                {state == STATE_STOPPED && (
                  <TouchableOpacity onPress={() => null}>
                    <Icon
                      name="square"
                      size={30}
                      color={theme.color.blueShade1}
                    ></Icon>
                  </TouchableOpacity>
                )}
              </Box>
            </Box>
          </Box>
          {/* <Box h={1} dir="row">
            <Box f={position} bg="#0099ff" />
            <Box f={duration - position} bg="#606060" />
          </Box> */}
          <ProgressSlider />
        </TouchableOpacity>
      ) : null}
    </>
  );
}
