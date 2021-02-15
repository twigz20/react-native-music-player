import React from "react";
import { Box } from "react-native-design-utility";
import { useTrackPlayerProgress } from "react-native-track-player";
import { useSelector } from "react-redux";

const ProgressSlider = () => {
  const { duration } = useSelector((state) => state.Player);
  const progress = useTrackPlayerProgress();

  return (
    <Box h={1} dir="row">
      <Box f={progress.position} bg="#0099ff" />
      <Box f={duration - progress.position} bg="#606060" />
    </Box>
  );
};

export default ProgressSlider;
