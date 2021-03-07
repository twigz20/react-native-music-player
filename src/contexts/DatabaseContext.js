/* eslint-disable react/display-name */
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import arrayShuffle from "array-shuffle";
import { PlaylistType } from "../constants/constants";
import { setDBInitialized } from "../reducers/Library";
import { arraysEqual, objectsEqual } from "../utils/helpers.js";
import { useContext } from "react";
import { database } from "../database";

export const DatabaseContext = React.createContext(undefined);

export const DatabaseProvider = memo((props) => {
  const [tracks, setTracks] = React.useState([]);
  const [playlists, setPlaylists] = React.useState([]);
  const [playlistImageIds, setPlaylistImageIds] = React.useState(
    Array.from(Array(50).keys())
  );

  React.useEffect(() => {
    (async () => {
      let playlists = await database.getPlaylists();
      setPlaylists(playlists);
      let trackInfos = await database.getTracksInfo();
      setTracks(trackInfos);

      updatePlaylistImageIds(playlists);
    })();
  }, []);

  const updatePlaylistImageIds = async (playlists) => {
    let usedPlaylistImageIds = playlists.map((p) =>
      parseInt(p.playlist_image_id)
    );

    let _playlistImageIds = playlistImageIds.filter(
      (pi) => !usedPlaylistImageIds.includes(pi)
    );

    if (!objectsEqual(playlistImageIds, _playlistImageIds)) {
      setPlaylistImageIds(_playlistImageIds);
    }
  };

  const addPlaylist = async (playlist_id, tracks = []) => {
    try {
      let _playlistImageIds = arrayShuffle(playlistImageIds);
      if (_playlistImageIds.length == 0) {
        _playlistImageIds = arrayShuffle(Array.from(Array(50).keys()));
      }
      let playlist_image_id = _playlistImageIds.pop();
      await database.addPlaylist({
        playlist_id: playlist_id,
        playlist_image_id: playlist_image_id,
        tracks: tracks,
      });
      setPlaylistImageIds(_playlistImageIds);

      await updatePlaylistState();
    } catch (error) {
      console.warn(error);
    }
  };

  const renamePlaylist = async (old_playlist_id, new_playlist_id) => {
    try {
      await database.renamePlaylist(old_playlist_id, new_playlist_id);
      await updatePlaylistState();
    } catch (error) {
      console.warn(error);
    }
  };

  const deletePlaylist = async (playlist_id) => {
    try {
      await database.deletePlaylist(playlist_id);
      await updatePlaylistState();
    } catch (error) {
      console.warn(error);
    }
  };

  const addToPlaylist = async (playlist_ids, track_id) => {
    try {
      for (let i = 0; i < playlist_ids.length; i++) {
        let playlist = playlists.find((p) => p.playlist_id == playlist_ids[i]);
        if (playlist) {
          playlist.tracks.push(track_id);
          playlist.tracks = [...new Set(playlist.tracks)];
          await database.updatePlaylistTracks(playlist);
          await updatePlaylistState();
        }
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const clearPlaylist = async (playlist_id) => {
    try {
      let playlist = playlists.find((p) => p.playlist_id == playlist_id);
      if (playlist) {
        playlist.tracks = [];
        await database.updatePlaylistTracks(playlist);
        await updatePlaylistState();
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const updatePlaylistState = async () => {
    let _playlists = await database.getPlaylists();
    if (!arraysEqual(playlists, _playlists)) {
      setPlaylists(_playlists);
    }
  };

  // Tracks

  const favTrack = async (track_id, favourite) => {
    let track = tracks.find((t) => t.track_id == track_id);
    if (track) {
      track.favourite = favourite;
      await database.updateTrackInfo(track);
      await updateTrackState();
    }
  };

  const updatePlayInfo = async (track_id) => {
    let track = tracks.find((t) => t.track_id == track_id);

    if (track) {
      track.play_count++;
      track.last_played = Date();

      await database.updateTrackInfo(track);

      await updateTrackState();
    }
  };

  const updateTrackState = async () => {
    let _tracks = await database.getTracksInfo();
    if (!arraysEqual(tracks, _tracks)) {
      setTracks(_tracks);
    }
  };

  const getTrackInfo = (track_id) => {
    return tracks.find((t) => t.track_id == track_id);
  };

  const value = {
    tracks,
    playlists,
    favTrack,
    updatePlayInfo,
    getTrackInfo,
    addPlaylist,
    deletePlaylist,
    clearPlaylist,
    renamePlaylist,
    addToPlaylist,
  };

  return (
    <DatabaseContext.Provider value={value} database={database}>
      {props.children}
    </DatabaseContext.Provider>
  );
});

export function useDatabase() {
  const database = useContext(DatabaseContext);
  if (database === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return database;
}
