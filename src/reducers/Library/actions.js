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

export function setTrackList(tracks) {
  return (dispatch) => {
    dispatch({
      type: types.SET_TRACKS,
      payload: tracks,
    });
  };
}

export const getTrackList = () => {
  return (dispatch) => {
    fetch("http://192.168.1.113:8161/tracks", {
      method: "GET",
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        dispatch({
          type: types.SET_TRACKS,
          payload: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

export function setDBInitialized(dbInit = true) {
  return {
    type: types.INIT_DB,
    payload: dbInit,
  };
}
