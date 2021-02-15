import * as types from "./types";
import TrackPlayer from "react-native-track-player";

export const setAllPlaylists = (playlists) => {
  return {
    type: types.SET_ALL_PLAYLISTS,
    payload: playlists,
  };
};

export function setPlaylist(id) {
  return {
    type: types.SET_PLAYLIST,
    payload: {
      id,
    },
  };
}

export const getTrackList = () => {
  return (dispatch) => {
    fetch("http://192.168.1.113:8161/tracks", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        dispatch({
          type: types.GET_PLAYLIST,
          payload: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};