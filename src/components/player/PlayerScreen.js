import React, { useContext, useEffect, useState, memo } from "react";
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { useNavigation } from "@react-navigation/native";
import { Entypo, MaterialCommunityIcons } from "react-native-vector-icons";

import LinearGradient from "react-native-linear-gradient";

import { theme } from "../../constants/theme.js";
import { makeHitSlop } from "../../constants/metrics.js";
import { Box, Text } from "react-native-design-utility";
import ProgressSlider from "./ProgressSlider.js";
import { useDispatch, useSelector } from "react-redux";

import TrackPlayer, {
  useTrackPlayerEvents,
  TrackPlayerEvents,
  STATE_PAUSED,
} from "react-native-track-player";

import {
  setUserPlaying,
  setReplay,
  setShuffleMode,
} from "../../reducers/Player/actions.js";
import { DBContext } from "../../contexts/DBContext.js";
import TextTicker from "react-native-text-ticker";

const { width, height } = Dimensions.get("window");

// Subscribing to the following events inside MiniPlayer
const events = [
  TrackPlayerEvents.PLAYBACK_STATE,
  TrackPlayerEvents.PLAYBACK_ERROR,
];

const PlayerScreen = () => {
  const dispatch = useDispatch();
  const { track, playing, shuffle, replay } = useSelector(
    (state) => state.Player
  );
  const dbContext = useContext(DBContext);

  const navigation = useNavigation();
  const [isFavourite, setFavourite] = useState(false);
  const [state, setState] = useState(TrackPlayerEvents.STATE_PLAYING);

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

  const onPressShuffle = () => {
    dispatch(setShuffleMode(!shuffle));
  };

  const onPressReplay = (_replay) => {
    dispatch(setReplay(_replay));
  };

  const onClickPlayPause = () => {
    dispatch(setUserPlaying(!playing));
  };

  const getBeforeAfterQueue = (trackId, playlists) => {
    let foundCurrentTrackId = false;
    let before = [];
    let after = [];
    for (let i = 0; i < playlists.length; i++) {
      if (playlists[i].id == trackId) {
        foundCurrentTrackId = true;
        continue;
      }
      if (foundCurrentTrackId) {
        after.push(playlists[i].id);
      } else {
        before.push(playlists[i].id);
      }
    }

    return {
      before,
      after,
    };
  };

  const onPressPrev = async () => {
    const time = await TrackPlayer.getPosition();

    const queue = await TrackPlayer.getQueue();
    const before = getBeforeAfterQueue(track.id, queue).before;

    if (time <= 3 && before.length) {
      TrackPlayer.skipToPrevious();
    } else {
      TrackPlayer.seekTo(0);
    }
  };

  const onPressNext = async () => {
    const queue = await TrackPlayer.getQueue();
    const after = getBeforeAfterQueue(track.id, queue).after;

    if (after.length) {
      TrackPlayer.skipToNext();
    } else if (replay == "replay") {
      // TODO: Consider Restarting the whole queue rather than the part that it started from
      TrackPlayer.skip(queue[0].id.toString());
    }
  };

  let shuffleColor = theme.color.white;
  if (shuffle) {
    shuffleColor = theme.color.blueShade1;
  }

  let replayButton;
  if (replay == "replay") {
    replayButton = (
      <TouchableOpacity
        onPress={() => {
          onPressReplay("replayOne");
        }}
      >
        <MaterialCommunityIcons
          name="repeat"
          size={25}
          color={theme.color.blueShade1}
        ></MaterialCommunityIcons>
      </TouchableOpacity>
    );
  } else if (replay == "replayOne") {
    replayButton = (
      <TouchableOpacity
        onPress={() => {
          onPressReplay("none");
        }}
      >
        <MaterialCommunityIcons
          name="repeat-once"
          size={25}
          color={theme.color.blueShade1}
        ></MaterialCommunityIcons>
      </TouchableOpacity>
    );
  } else {
    replayButton = (
      <TouchableOpacity
        onPress={() => {
          onPressReplay("replay");
        }}
      >
        <MaterialCommunityIcons
          name="repeat-off"
          size={25}
          color={theme.color.white}
        ></MaterialCommunityIcons>
      </TouchableOpacity>
    );
  }

  return (
    <>
      {/* <LinearGradient
        colors={[
          playerContext.artworkGradientColors.vibrantColor,
          playerContext.artworkGradientColors.darkVibrantColor,
          "#020024",
        ]}
        style={styles.container}
      > */}
      {track != null ? (
        <ImageBackground
          style={{ flex: 1 }}
          source={{ uri: track.artwork }}
          blurRadius={10}
        >
          <Box f={1} pt="md">
            <Box px="md" mb="md" dir="row" align="center" justify="between">
              <TouchableOpacity
                onPress={navigation.goBack}
                hitSlop={makeHitSlop(20)}
              >
                <Icon name="chevron-down" size={30} color="white" />
              </TouchableOpacity>
            </Box>
            <Box center mb="md" h="40%">
              <Image source={{ uri: track.artwork }} style={styles.img} />
            </Box>

            <Box h="10%"></Box>

            <Box px="md" mb="md" dir="row" align="center" justify="between">
              <TouchableOpacity onPress={onFavourite}>
                <MaterialCommunityIcons
                  name={isFavourite ? "heart" : "heart-outline"}
                  size={20}
                  color={
                    isFavourite ? theme.color.blueShade1 : theme.color.white
                  }
                />
              </TouchableOpacity>
              <Box
                center
                mb="sm"
                justify="center"
                align="center"
                dir="col"
                w="80%"
              >
                <TextTicker
                  style={{ fontSize: 15, color: theme.color.white }}
                  numberOfLines={1}
                  duration={15000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={1000}
                >
                  {track.title}
                </TextTicker>
                <Text color="grey" size={10} numberOfLines={1}>
                  {track.artists}
                </Text>
              </Box>
              <TouchableOpacity onPress={() => navigation.navigate("Queue")}>
                <MaterialCommunityIcons
                  name="playlist-music"
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </Box>

            <Box px="md" mb="sm">
              <ProgressSlider />
            </Box>

            <Box dir="row" align="center" justify="center" mt={20}>
              <Box>
                <TouchableOpacity
                  onPress={onPressShuffle}
                  style={{ marginLeft: "9%" }}
                >
                  <MaterialCommunityIcons
                    name="shuffle"
                    size={25}
                    color={shuffleColor}
                  ></MaterialCommunityIcons>
                </TouchableOpacity>
              </Box>
              <Box>
                <TouchableOpacity
                  onPress={onPressPrev}
                  style={{ marginLeft: "12%" }}
                >
                  <Entypo
                    name="controller-jump-to-start"
                    size={30}
                    color="white"
                  />
                </TouchableOpacity>
              </Box>

              <Box>
                {state == STATE_PAUSED ? (
                  <TouchableOpacity
                    onPress={onClickPlayPause}
                    style={{ marginLeft: "12%" }}
                  >
                    <Entypo name="controller-play" size={30} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={onClickPlayPause}
                    style={{ marginLeft: "12%" }}
                  >
                    <Entypo name="controller-paus" size={30} color="white" />
                  </TouchableOpacity>
                )}
              </Box>
              <Box>
                <TouchableOpacity
                  onPress={onPressNext}
                  style={{ marginLeft: "12%" }}
                >
                  <Entypo name="controller-next" size={30} color="white" />
                </TouchableOpacity>
              </Box>
              <Box>{replayButton}</Box>
            </Box>
          </Box>
        </ImageBackground>
      ) : null}
      {/* </LinearGradient> */}
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    height: height,
    width: width,
  },
  img: {
    width: width - theme.space.md * 4,
    height: width - theme.space.md * 4,
    borderRadius: 10,
  },
});

export default memo(PlayerScreen);
