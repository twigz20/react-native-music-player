import React, { PureComponent } from "react";
import { TouchableOpacity, Image } from "react-native";
import { Box } from "react-native-design-utility";

import { MaterialCommunityIcons } from "react-native-vector-icons";

import { theme } from "../../constants/theme";
import { setUserPlaying } from "../../reducers/Player/actions";
import { DBContext } from "../../contexts/DBContext.js";

import store from "../../provider/store";

class Controller extends PureComponent {
  static contextType = DBContext;

  constructor() {
    super();
    this.state = {
      playing: false,
      isFavourite: false,
      track: null,
    };
  }

  componentDidMount() {
    store.subscribe(() => {
      const { playing, track } = store.getState().Player;

      const db = this.context;
      let trackInfo = db.getTrackInfo(track.id);

      this.setState({
        playing: playing,
        track: track,
        isFavourite: !!trackInfo.favourite,
      });
    });
  }

  onFavourite = async () => {
    const db = this.context;
    let trackInfo = db.getTrackInfo(this.state.track.id);
    let fav = !!!trackInfo.favourite;
    await db.favTrack(this.state.track.id, fav);
    this.setState({
      isFavourite: fav,
    });
  };

  onClickPlayPause = () => {
    store.dispatch(setUserPlaying(!this.state.playing));
  };

  render() {
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
