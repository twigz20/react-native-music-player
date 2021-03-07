import React from "react";
import { Box } from "react-native-design-utility";
import { useTrackPlayerProgress } from "react-native-track-player";

const ProgressSlider = ({ duration }) => {
  const { position } = useTrackPlayerProgress();

  return (
    <Box h={1} dir="row">
      <Box f={position} bg="#0099ff" />
      <Box f={duration - position} bg="#606060" />
    </Box>
  );
};

export default ProgressSlider;
