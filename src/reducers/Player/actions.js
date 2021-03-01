import TrackPlayer, {
  STATE_STOPPED,
  STATE_BUFFERING,
  STATE_PAUSED,
  STATE_NONE,
  STATE_PLAYING,
  STATE_READY,
} from "react-native-track-player";

import * as types from "./types";

import { getTrackList } from "../Library/actions";

import arrayShuffle from "array-shuffle";

export function initializePlayback() {
  return async (dispatch, getState) => {
    TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SEEK_TO,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      ],
    });

    await TrackPlayer.setupPlayer({
      maxCacheSize: 1024 * 5, // 5 mb
    });

    // dispatch(getTrackList());
    dispatch({ type: types.INIT });
  };
}

export function playbackState() {
  return async (dispatch) => {
    const state = await TrackPlayer.getState();

    dispatch({
      type: types.STATE,
      payload: {
        state,
      },
    });
  };
}

export function playbackTrack() {
  return async (dispatch, getState) => {
    const { track, playlist } = getState().Player;
    if (track != null) {
      const trackId = await TrackPlayer.getCurrentTrack();
      const duration = await TrackPlayer.getDuration();

      const track = await TrackPlayer.getTrack(trackId);

      dispatch({
        type: types.TRACK,
        payload: {
          track,
          duration,
          playlist,
        },
      });
    }
  };
}

export function updatePlayback() {
  return async (dispatch) => {
    dispatch(playbackState());
  };
}

export function setUserPlaying(playing) {
  return (dispatch, getState) => {
    const { track } = getState().Player;

    if (track) {
      TrackPlayer[playing ? "play" : "pause"]();

      dispatch({
        type: types.PLAYING,
        payload: {
          playing,
        },
      });
    }
  };
}

export function setCurrentTrack(track, playlistId) {
  return {
    type: types.TRACK,
    payload: {
      track,
      duration: track.duration,
      playlist: playlistId,
    },
  };
}

export function setShuffle(shuffle) {
  return {
    type: types.SHUFFLE,
    payload: {
      shuffle,
    },
  };
}
export function setShuffleMode(shuffle) {
  return async (dispatch, getState) => {
    const { playlist } = getState().Player;
    const { playlists, tracks } = getState().Library;
    let trackId = await TrackPlayer.getCurrentTrack();
    let beforeAfterQueue = getBeforeAfterQueue(trackId, playlist, playlists);

    if (shuffle) {
      let queue = [...beforeAfterQueue.before, ...beforeAfterQueue.after];

      await TrackPlayer.remove(queue.map((t) => t.toString()));

      let shuffled = arrayShuffle(queue);
      shuffled = [...new Set(shuffled)];
      let shuffledTrackList = [];

      shuffled.forEach((track_id) => {
        let track = tracks.find((t) => t.id == track_id);
        if (track) {
          shuffledTrackList.push(track);
        }
      });

      await TrackPlayer.add(shuffledTrackList);
    } else {
      let queue = await TrackPlayer.getQueue();
      await TrackPlayer.remove(queue.map((t) => t.id.toString()));

      let afterTrackList = tracks.filter((t) =>
        beforeAfterQueue.after.includes(t.id)
      );

      await TrackPlayer.add(afterTrackList);
    }

    dispatch(setShuffle(shuffle));
  };
}

export function setReplay(replay) {
  return {
    type: types.REPLAY,
    payload: {
      replay,
    },
  };
}

export function playbackQueueEnded(position) {
  return async (dispatch, getState) => {
    const { shuffle, replay, track, playlist } = getState().Player;
    const { playlists, tracks } = getState().Library;

    const state = await TrackPlayer.getState();

    // For some reason this event gets fired multiple times
    if (track != null && state == STATE_STOPPED) {
      if (replay == "replayOne") {
        await TrackPlayer.seekTo(0);
        await TrackPlayer.play();
      } else if (replay == "replay" && !shuffle) {
        let beforeAfterQueue = getBeforeAfterQueue(
          track.id,
          playlist,
          playlists
        );

        await TrackPlayer.remove(
          beforeAfterQueue.before.map((t) => t.toString())
        );

        await TrackPlayer.remove(
          beforeAfterQueue.after.map((t) => t.toString())
        );

        let beforeTrackList = tracks.filter((t) =>
          beforeAfterQueue.before.includes(t.id)
        );
        let afterTrackList = tracks.filter((t) =>
          beforeAfterQueue.after.includes(t.id)
        );

        await TrackPlayer.add(beforeTrackList, track.id.toString());
        await TrackPlayer.add(afterTrackList);

        let queue = await TrackPlayer.getQueue();
        await TrackPlayer.skip(queue[0].id.toString());

        dispatch(setUserPlaying(true));
      } else if (replay == "replay") {
        let queue = await TrackPlayer.getQueue();
        await TrackPlayer.skip(queue[0].id.toString());

        dispatch(setUserPlaying(true));
      }
    }
  };
}

export function setPlaylist(id) {
  return {
    type: types.PLAYLIST,
    payload: {
      playlist: id,
    },
  };
}

export function playerReset() {
  return { type: types.RESET };
}

function getBeforeAfterQueue(trackId, playlistId, playlists) {
  let foundCurrentTrackId = false;
  let before = [];
  let after = [];
  try {
    let playlistTracks = playlists[playlistId];
    for (let i = 0; i < playlistTracks.length; i++) {
      if (playlistTracks[i] == trackId) {
        foundCurrentTrackId = true;
        continue;
      }
      if (foundCurrentTrackId) {
        after.push(playlistTracks[i]);
      } else {
        before.push(playlistTracks[i]);
      }
    }
  } catch (error) {
    console.log("Error: ", error);
  }

  return {
    before,
    after,
  };
}

export function itemPlay(id, playlistId, reset = true) {
  return async (dispatch, getState) => {
    try {
      const { shuffle, playlist } = getState().Player;
      const { playlists, tracks } = getState().Library;

      if (playlistId !== playlist || !reset) {
        await TrackPlayer.reset();

        if (reset) {
          dispatch(playerReset());
        }

        let track = tracks.find((track) => track.id == id);
        await TrackPlayer.add([track]);

        let beforeAfterQueue = getBeforeAfterQueue(id, playlistId, playlists);
        let afterTrackList = tracks.filter((t) =>
          beforeAfterQueue.after.includes(t.id)
        );

        await TrackPlayer.add(afterTrackList);

        dispatch(setCurrentTrack(track, playlistId));
      }

      await TrackPlayer.skip(id.toString());

      dispatch(setShuffleMode(shuffle));

      dispatch(setUserPlaying(true));
    } catch (error) {
      console.log("Play Error: ", error);
    }
  };
}
