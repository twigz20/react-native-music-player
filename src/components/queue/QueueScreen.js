import React from "react";
import { Box, Text } from "react-native-design-utility";
import { FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import BackgroundImage from "../background/BackgroundImage.js";

import { theme } from "../../constants/theme";
import TrackPlayer from "react-native-track-player";
import QueueNavBar from "../navbar/QueueNavBar.js";
import SongQueueItem from "../song/SongQueueItem.js";

import DraggableFlatList from "react-native-draggable-flatlist";
import { useDispatch, useSelector } from "react-redux";
import { buildTime } from "../../utils/helpers.js";

const QueueScreen = () => {
  const [queue, setQueue] = React.useState([]);
  const [trackNumber, setTrackNumber] = React.useState(1);
  const [maxTrackNumber, setMaxTrackNumber] = React.useState(1);
  const [timeRemaining, setTimeRemaining] = React.useState("00:00");
  const { track } = useSelector((state) => state.Player);
  const { id: playlistId } = useSelector((state) => state.Song);

  const setTrackNumbers = async (tracks) => {
    setMaxTrackNumber(tracks.length);
    if (track != null) {
      let _trackNumber = tracks.map((t) => t.id).indexOf(track.id.toString());
      setTrackNumber(_trackNumber + 1);

      let timeRemainingSeconds = 0;
      let foundCurrentTrack = false;
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].id == track.id) {
          foundCurrentTrack = true;
        }
        timeRemainingSeconds += foundCurrentTrack ? tracks[i].duration : 0;
      }
      setTimeRemaining(buildTime(timeRemainingSeconds));
    }
  };

  const getQueue = async () => {
    let tracks = await TrackPlayer.getQueue();
    setQueue(tracks);
    setTrackNumbers(tracks);
  };

  useFocusEffect(
    React.useCallback(() => {
      getQueue();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      getQueue();
    }, [track])
  );

  // const renderItem = useCallback(({ item, index, drag, isActive }) => {
  //   return <SongQueueItem track={item} drag={drag} />;
  // }, []);

  return (
    <BackgroundImage>
      <QueueNavBar />
      <Box ml={10}>
        <Text color={theme.color.white} size={35} bold>
          Playing Queue
        </Text>
        <Text color={theme.color.blueShade1} size={14} mt={10} mb={10}>
          Up next - {trackNumber}/{maxTrackNumber} - {timeRemaining}
        </Text>
      </Box>
      {/* <DraggableFlatList
        data={queue}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.id}`}
        onDragEnd={({ data }) => setQueue(data)}
      /> */}
      <FlatList
        data={queue}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item }) => (
          <SongQueueItem track={item} getQueue={getQueue} />
        )}
      />
    </BackgroundImage>
  );
};

export default QueueScreen;
