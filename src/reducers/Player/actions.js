import TrackPlayer, {
  STATE_STOPPED,
  STATE_BUFFERING,
  STATE_PAUSED,
  STATE_NONE,
  STATE_PLAYING,
  STATE_READY,
} from "react-native-track-player";

import * as types from "./types";

import { setPlaylist, getTrackList } from "../Song/actions";

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

    setInterval(async () => {
      const [position, duration] = await Promise.all([
        TrackPlayer.getPosition(),
        TrackPlayer.getDuration(),
      ]);

      const { replay, shuffle, track } = getState().Player;

      if (position && duration && position >= duration) {
        if (replay == "replayOne") {
          await TrackPlayer.seekTo(0);
        }
        // else if (shuffle) {
        //   let queue = await TrackPlayer.getQueue();
        //   queue = queue.filter((item) => item.id !== track.id);

        //   const count = queue.length - 1;
        //   const index = Math.floor(Math.random() * count);

        //   const trackId = queue[index].id;

        //   await TrackPlayer.skip(trackId);
        // }
      }
    }, 500);

    dispatch(getTrackList());
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
    const { track } = getState().Player;
    if (track != null) {
      const trackId = await TrackPlayer.getCurrentTrack();
      const duration = await TrackPlayer.getDuration();

      const track = await TrackPlayer.getTrack(trackId);

      dispatch({
        type: types.TRACK,
        payload: {
          track,
          duration,
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

export function setCurrentTrack(track) {
  return {
    type: types.TRACK,
    payload: {
      track,
      duration: track.duration,
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
    const { id, playlists } = getState().Song;
    let trackId = await TrackPlayer.getCurrentTrack();
    let beforeAfterQueue = getBeforeAfterQueue(trackId, id, playlists);

    if (shuffle) {
      let queue = [...beforeAfterQueue.before, ...beforeAfterQueue.after];

      await TrackPlayer.remove(queue.map((t) => t.id.toString()));

      let shuffled = arrayShuffle(queue);

      await TrackPlayer.add(shuffled);
    } else {
      let queue = await TrackPlayer.getQueue();
      await TrackPlayer.remove(queue.map((t) => t.id.toString()));
      await TrackPlayer.add(beforeAfterQueue.after);
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
    const { shuffle, replay, track } = getState().Player;
    const { id, playlists } = getState().Song;

    const state = await TrackPlayer.getState();

    // For some reason this event gets fired multiple times
    if (track != null && state == STATE_STOPPED) {
      if (replay == "replay" && !shuffle) {
        let beforeAfterQueue = getBeforeAfterQueue(track.id, id, playlists);

        await TrackPlayer.remove(
          beforeAfterQueue.before.map((t) => t.id.toString())
        );

        await TrackPlayer.remove(
          beforeAfterQueue.after.map((t) => t.id.toString())
        );

        await TrackPlayer.add(beforeAfterQueue.before, track.id.toString());
        await TrackPlayer.add(beforeAfterQueue.after);

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
      if (playlistTracks[i].id == trackId) {
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
    const { shuffle } = getState().Player;
    const { id: playId, playlists } = getState().Song;

    if (playlistId !== playId || !reset) {
      await TrackPlayer.reset();

      if (reset) {
        dispatch(playerReset());
      }

      let beforeAfterQueue = getBeforeAfterQueue(id, playlistId, playlists);

      let track = playlists[playlistId].find((item) => item.id == id);
      await TrackPlayer.add([track]);
      await TrackPlayer.add(beforeAfterQueue.after);

      dispatch(setCurrentTrack(track));

      dispatch(setPlaylist(playlistId));
    }

    await TrackPlayer.skip(id.toString());

    dispatch(setShuffleMode(shuffle));

    dispatch(setUserPlaying(true));
  };
}
