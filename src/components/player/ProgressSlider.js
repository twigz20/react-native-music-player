import React from "react";
import TrackPlayer, { ProgressComponent } from "react-native-track-player";
import Slider from "@react-native-community/slider";
import { Box, Text } from "react-native-design-utility";

import { theme } from "../../constants/theme";
import { buildTime } from "../../utils/helpers";

class ProgressSlider extends ProgressComponent {
  get totalTime() {
    return buildTime(this.state.duration - this.state.position);
  }

  get totalTimeNoChange() {
    return buildTime(this.state.duration);
  }

  get currentTime() {
    return buildTime(this.state.position);
  }

  render() {
    const seekTo = async (amount) => {
      await TrackPlayer.seekTo(amount);
    };

    return (
      <>
        <Box dir="row" align="center" justify="between">
          <Text color="#A9A9A9" size={8}>
            {this.currentTime}
          </Text>
          <Slider
            style={{ width: "90%", height: 10 }}
            minimumValue={0}
            maximumValue={this.state.duration}
            value={this.state.position}
            onSlidingComplete={seekTo}
            thumbTintColor="white"
            minimumTrackTintColor="white"
            maximumTrackTintColor="#A9A9A9"
          />
          <Text color="#A9A9A9" size={8}>
            {this.totalTimeNoChange}
          </Text>
        </Box>
      </>
    );
  }
}

export default ProgressSlider;
