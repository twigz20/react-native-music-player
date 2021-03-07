import React, {
  useContext,
  useEffect,
  useState,
  memo,
  PureComponent,
} from "react";
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
  setCurrentTrack,
} from "../../reducers/Player/actions.js";

import store from "../../provider/store";

const { width, height } = Dimensions.get("window");

class PlayerScreen extends PureComponent {
  constructor() {
    super();

    const { track, playing, shuffle, replay } = store.getState().Player;

    this.state = {
      track,
      playing,
      shuffle,
      replay,
    };
  }

  componentDidMount() {
    store.subscribe(() => {
      const { track, playing, shuffle, replay } = store.getState().Player;

      this.setState({
        playing,
        track,
        replay,
        shuffle,
      });
    });
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  onPressShuffle = () => {
    store.dispatch(setShuffleMode(!this.state.shuffle));
  };

  onPressReplay = (_replay) => {
    store.dispatch(setReplay(_replay));
  };

  onClickPlayPause = () => {
    store.dispatch(setUserPlaying(!this.state.playing));
  };

  getBeforeAfterQueue = (trackId, playlists) => {
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

  onPressPrev = async () => {
    const time = await TrackPlayer.getPosition();

    const queue = await TrackPlayer.getQueue();
    const before = this.getBeforeAfterQueue(this.state.track.id, queue).before;

    if (time <= 3 && before.length) {
      await TrackPlayer.skipToPrevious();
      let currentTrack = await TrackPlayer.getTrack(
        before[before.length - 1].toString()
      );
      store.dispatch(setCurrentTrack(currentTrack));
    } else {
      TrackPlayer.seekTo(0);
    }
  };

  onPressNext = async () => {
    const queue = await TrackPlayer.getQueue();
    const after = this.getBeforeAfterQueue(this.state.track.id, queue).after;

    if (after.length) {
      await TrackPlayer.skipToNext();
      let currentTrack = await TrackPlayer.getTrack(after[0].toString());
      store.dispatch(setCurrentTrack(currentTrack));
    } else if (replay == "replay") {
      // TODO: Consider Restarting the whole queue rather than the part that it started from
      TrackPlayer.skip(queue[0].id.toString());
    }
  };

  render() {
    let shuffleColor = theme.color.white;
    if (this.state.shuffle) {
      shuffleColor = theme.color.blueShade1;
    }

    let replayButton;
    if (this.state.replay == "replay") {
      replayButton = (
        <TouchableOpacity
          onPress={() => {
            this.onPressReplay("replayOne");
          }}
        >
          <MaterialCommunityIcons
            name="repeat"
            size={25}
            color={theme.color.blueShade1}
          ></MaterialCommunityIcons>
        </TouchableOpacity>
      );
    } else if (this.state.replay == "replayOne") {
      replayButton = (
        <TouchableOpacity
          onPress={() => {
            this.onPressReplay("none");
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
            this.onPressReplay("replay");
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
        <Box dir="row" align="center" justify="center" mt={20}>
          <Box>
            <TouchableOpacity
              onPress={this.onPressShuffle}
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
              onPress={this.onPressPrev}
              style={{ marginLeft: "12%" }}
            >
              <Entypo name="controller-jump-to-start" size={30} color="white" />
            </TouchableOpacity>
          </Box>

          <Box>
            {this.state.playing ? (
              <TouchableOpacity
                onPress={this.onClickPlayPause}
                style={{ marginLeft: "12%" }}
              >
                <MaterialCommunityIcons
                  name="pause"
                  size={30}
                  color={theme.color.white}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={this.onClickPlayPause}
                style={{ marginLeft: "12%" }}
              >
                <MaterialCommunityIcons
                  name="play"
                  size={30}
                  color={theme.color.white}
                />
              </TouchableOpacity>
            )}
          </Box>
          <Box>
            <TouchableOpacity
              onPress={this.onPressNext}
              style={{ marginLeft: "12%" }}
            >
              <Entypo name="controller-next" size={30} color="white" />
            </TouchableOpacity>
          </Box>
          <Box>{replayButton}</Box>
        </Box>
      </>
    );
  }
}

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
