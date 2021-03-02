import { PlaylistType } from "../../constants/constants";
import initialState from "./initialState";
import * as types from "./types";
export * from "./actions";

export default function reducer(state = initialState(), { type, payload }) {
  switch (type) {
    case types.SET_ALL_PLAYLISTS:
      return Object.assign({}, state, {
        playlists: payload,
      });

    case types.INIT_DB:
      return Object.assign({}, state, {
        dbInit: payload,
      });

    case types.SET_TRACKS: {
      let artists = {};
      let albums = {};

      let playlists = {};
      playlists[PlaylistType.ALL] = payload.map((t) => t.id);
      playlists[PlaylistType.FAVOURITES] = [];
      playlists[PlaylistType.MOST_PLAYED] = [];
      playlists[PlaylistType.RECENTLY_PLAYED] = [];

      payload.forEach((track) => {
        let mainArtist = track.artists.split(",")[0];

        if (!artists[track.artist_id]) {
          artists[track.artist_id] = {
            artwork: track.artist_image,
            albums: [],
            trackCount: 0,
            name: mainArtist,
          };
          playlists[`Artist-${track.artist_id}`] = [track.id];
        }

        if (!artists[track.artist_id].albums.includes(track.album_id)) {
          artists[track.artist_id].albums.push(track.album_id);
        }

        artists[track.artist_id].trackCount++;
        playlists[`Artist-${track.artist_id}`].push(track.id);

        if (!Object.keys(albums).includes(track.album_id.toString())) {
          albums[track.album_id] = {
            name: track.album,
            artist: mainArtist,
            artwork: track.album_image,
            tracks: [track.id],
          };
          playlists[`Album-${track.album_id}`] = [track.id];
        } else {
          albums[track.album_id].tracks.push(track.id);
          playlists[`Album-${track.album_id}`].push(track.id);
        }
      });

      return Object.assign({}, state, {
        playlists,
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
