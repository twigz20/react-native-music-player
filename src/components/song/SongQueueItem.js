/* eslint-disable react/prop-types */
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { List } from "react-native-paper";
import { Box } from "react-native-design-utility";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { theme } from "../../constants/theme";

import TrackPlayer from "react-native-track-player";
import { useState } from "react";

const SongQueueItem = ({ track, getQueue }) => {
  const navigation = useNavigation();
  const { track: currentTrack } = useSelector((state) => state.Player);
  const [isVisible, setIsVisible] = useState(true);

  const titleColor =
    currentTrack && track.id == currentTrack.id
      ? theme.color.blueShade1
      : "white";
  const _play = async () => {
    TrackPlayer.skip(track.id.toString());
  };

  const removeFromQueue = async () => {
    if (currentTrack && track.id != currentTrack.id) {
      TrackPlayer.remove(track.id.toString());
      setIsVisible(false);
      getQueue();
    }
  };

  return (
    <>
      {isVisible ? (
        <List.Item
          title={track.title}
          description={track.artist}
          titleStyle={{
            color: titleColor,
            fontSize: 15,
          }}
          descriptionStyle={{
            color: "#A0A0A0",
            fontSize: 12,
          }}
          left={() => (
            <Box
              h={60}
              w={60}
              radius={10}
              mr={10}
              justify="center"
              style={{ overflow: "hidden" }}
            >
              <Image
                source={{ uri: track.artwork }}
                style={styles.image_view}
              />
            </Box>
          )}
          right={() => (
            <>
              <TouchableOpacity onPress={removeFromQueue}>
                <Box f={1} justify="center" mr={10}>
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="white"
                  />
                </Box>
              </TouchableOpacity>
              <TouchableOpacity>
                <Box f={1} justify="center" mr={10}>
                  <MaterialCommunityIcons name="menu" size={20} color="white" />
                </Box>
              </TouchableOpacity>
            </>
          )}
          onPress={async () => {
            await _play(track.id);
            navigation.goBack();
          }}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  image_view: {
    flex: 1,
    width: "100%",
  },
});

export default SongQueueItem;
