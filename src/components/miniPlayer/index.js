import { useNavigation } from "@react-navigation/native";
import React, { memo } from "react";
import { TouchableOpacity, Image } from "react-native";
import { Box, Text } from "react-native-design-utility";

import ProgressSlider from "./ProgressSlider.js";

import { theme } from "../../constants/theme";
import { useSelector } from "react-redux";
import TextTicker from "react-native-text-ticker";
import Controller from "./Controller.js";

const MiniPlayer = () => {
  const track = useSelector((state) => state.Player.track);
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
              <Controller />
            </Box>
          </Box>
          <ProgressSlider duration={track.duration} />
        </TouchableOpacity>
      ) : null}
    </>
  );
};

export default memo(MiniPlayer);
