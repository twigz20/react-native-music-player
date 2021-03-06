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
import ProgressSlider from "../../components/player/ProgressSlider.js";
import { useSelector } from "react-redux";
import { DBContext } from "../../contexts/DBContext.js";
import TextTicker from "react-native-text-ticker";
import Controller from "../../components/player/Controller.js";

const { width, height } = Dimensions.get("window");

const PlayerScreen = () => {
  const track = useSelector((state) => state.Player.track);
  const dbContext = useContext(DBContext);

  const navigation = useNavigation();
  const [isFavourite, setFavourite] = useState(false);

  useEffect(() => {
    if (track) {
      let trackInfo = dbContext.getTrackInfo(track.id);
      setFavourite(!!trackInfo.favourite);
    }
  }, [track]);

  const onFavourite = async () => {
    let trackInfo = dbContext.getTrackInfo(track.id);
    let fav = !!trackInfo.favourite;
    await dbContext.favTrack(track.id, fav);
    setFavourite(fav == 1);
  };

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
            <Controller />
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
