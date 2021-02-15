import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { TouchableOpacity, Image } from "react-native";
import { Box, Text } from "react-native-design-utility";
import {
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
import { useContext } from "react";
import { DBContext } from "../../contexts/DBContext.js";

export default function MiniPlayer() {
  const dispatch = useDispatch();
  const { track, state, playing } = useSelector((state) => state.Player);
  const dbContext = useContext(DBContext);
  const [isFavourite, setFavourite] = useState(false);

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
                <Text
                  numberOfLines={1}
                  size={12}
                  color={theme.color.blueShade1}
                >
                  {track.title}
                </Text>
                <Text numberOfLines={1} size={8} color={theme.color.blueShade1}>
                  {track.artist}
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
