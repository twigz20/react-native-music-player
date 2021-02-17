import * as types from "./types";

export const setAllPlaylists = (playlists) => {
  return {
    type: types.SET_ALL_PLAYLISTS,
    payload: playlists,
  };
};

export function setPlaylist(id) {
  return {
    type: types.SET_CURRENT_PLAYLIST,
    payload: {
      id,
    },
  };
}

export const getTrackList = () => {
  return (dispatch) => {
    fetch("http://192.168.1.113:8161/tracks?limit=5", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        dispatch({
          type: types.GET_TRACKS,
          payload: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};
