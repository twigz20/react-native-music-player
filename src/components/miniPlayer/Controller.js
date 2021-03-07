import React, { PureComponent } from "react";
import { TouchableOpacity, Image } from "react-native";
import { Box } from "react-native-design-utility";

import { MaterialCommunityIcons } from "react-native-vector-icons";

import { theme } from "../../constants/theme";
import { setUserPlaying } from "../../reducers/Player/actions";

import store from "../../provider/store";
import { objectsEqual } from "../../utils/helpers";
import { database } from "../../database";

class Controller extends PureComponent {
  constructor() {
    super();

    const { playing, track } = store.getState().Player;

    this.state = {
      playing: true,
      isFavourite: !!track.favourite,
      track: track,
    };
  }

  componentDidMount() {
    store.subscribe(async () => {
      const { playing, track } = store.getState().Player;

      let trackInfo = await database.getTrackInfo(track.id);

      let newState = {
        playing: playing,
        track: track,
        isFavourite: !!trackInfo.favourite,
      };

      this.setState({
        playing: playing,
        track: track,
        isFavourite: !!trackInfo.favourite,
      });
    });
  }

  onFavourite = async () => {
    let trackInfo = await database.getTrackInfo(this.state.track.id);
    trackInfo.favourite = !!!trackInfo.favourite;
    await database.updateTrackInfo(trackInfo);
    this.setState({
      isFavourite: trackInfo.favourite,
    });
  };

  onClickPlayPause = () => {
    store.dispatch(setUserPlaying(!this.state.playing));
  };

  render() {
    console.log("Controller");
    return (
      <Box f={1} dir="row">
        <Box f={1} align="end">
          <TouchableOpacity onPress={this.onFavourite}>
            <MaterialCommunityIcons
              name={this.state.isFavourite ? "heart" : "heart-outline"}
              size={30}
              color={theme.color.blueShade1}
            />
          </TouchableOpacity>
        </Box>
        <Box align="end">
          {this.state.playing ? (
            <TouchableOpacity onPress={this.onClickPlayPause}>
              <MaterialCommunityIcons
                name="pause"
                size={30}
                color={theme.color.blueShade1}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={this.onClickPlayPause}>
              <MaterialCommunityIcons
                name="play"
                size={30}
                color={theme.color.blueShade1}
              />
            </TouchableOpacity>
          )}
        </Box>
      </Box>
    );
  }
}

export default Controller;
