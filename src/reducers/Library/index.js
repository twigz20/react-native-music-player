import initialState from "./initialState";
import * as types from "./types";
export * from "./actions";

export default function reducer(state = initialState(), { type, payload }) {
  switch (type) {
    case types.SET_CURRENT_PLAYLIST:
      return {
        ...state,
        id: payload.id,
      };

    case types.SET_ALL_PLAYLISTS:
      return Object.assign({}, state, {
        playlists: payload,
      });

    case types.GET_TRACKS: {
      let artists = {};
      let albums = {};

      payload.forEach((track) => {
        let mainArtist = track.artists.split(",")[0];

        if (!artists[mainArtist]) {
          artists[mainArtist] = { artwork: track.artist_image, albums: [] };
        }

        if (!artists[mainArtist].albums.includes(track.album_id)) {
          artists[mainArtist].albums.push(track.album_id);
        }

        if (!Object.keys(albums).includes(track.album_id.toString())) {
          albums[track.album_id] = {
            name: track.album,
            artwork: track.album_image,
            tracks: [track.id],
          };
        } else {
          albums[track.album_id].tracks.push(track.id);
        }
      });

      return Object.assign({}, state, {
        artists,
        albums,
        tracks: payload,
        isLoading: false,
      });
    }
    default:
      return state;
  }
}
