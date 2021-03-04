import React from "react";
import { useDispatch, useSelector } from "react-redux";
import arrayShuffle from "array-shuffle";
import { PlaylistType } from "../constants/constants";
import { setDBInitialized } from "../reducers/Library";
import { SQliteServices } from "../services/sqliteServices";

export const DBContext = React.createContext({
  tracks: [],
  playlists: [],
  favTrack: () => Promise.resolve(),
  updatePlayInfo: () => Promise.resolve(),
  getTrackInfo: () => null,
  addPlaylist: () => null,
  deletePlaylist: () => null,
  clearPlaylist: () => null,
  renamePlaylist: () => null,
  addToPlaylist: () => null,
});

export const DBProvider = (props) => {
  const dispatch = useDispatch();
  const [tracks, setTracks] = React.useState([]);
  const [playlists, setPlaylists] = React.useState([]);
  const [isTracksLoaded, setIsTracksLoaded] = React.useState(false);
  const [isDbReady, setIsDbReady] = React.useState(false);
  const [playlistImageIds, setPlaylistImageIds] = React.useState(
    Array.from(Array(50).keys())
  );
  const db = React.useRef(null);

  const { tracks: storeTracks, playlists: storePlaylists } = useSelector(
    (state) => state.Library
  );

  React.useEffect(() => {
    (async () => {
      if (!isDbReady) {
        db.current = new SQliteServices();
        await db.current.init();
        setIsDbReady(db.current.isReady);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (db.current && db.current.isReady) {
      (async () => {
        if (db.current) {
          const _tracks = await db.current.getTracksInfo();
          setTracks(_tracks);
          let playlists = await db.current.getPlaylists();
          setPlaylists(playlists);
          setIsTracksLoaded(true);
        }
      })();
    }
  }, [isDbReady]);

  React.useEffect(() => {
    if (db.current && db.current.isReady) {
      (async () => {
        if (isTracksLoaded && storeTracks && storeTracks.length) {
          let currentDBTrackIds = tracks.map((t) => t.track_id);
          let newTracksAdded = false;
          for (let i = 0; i < storeTracks.length; i++) {
            if (!currentDBTrackIds.includes(storeTracks[i].id)) {
              insertTrackInfo(storeTracks[i].id);
              newTracksAdded = true;
            }
          }

          if (newTracksAdded) {
            const _tracks = await db.current.getTracksInfo();
            setTracks(_tracks);
          }

          await setPlaylistsInfo();

          updatePlaylistImageIds();

          dispatch(setDBInitialized());
        }
      })();
    }
  }, [isTracksLoaded, storeTracks]);

  React.useEffect(() => {
    if (db.current && db.current.isReady) {
      (async () => {
        if (isTracksLoaded) {
          await setPlaylistsInfo();
        }
      })();
    }
  }, [tracks]);

  const setPlaylistsInfo = async () => {
    let defaultPlaylists = Object.values(
      Object.keys(storePlaylists)
        .filter((key) => /^All Tracks$/.test(key))
        .reduce((playlist, key, index) => {
          playlist[index] = { name: key, tracks: storePlaylists[key] };
          return playlist;
        }, {})
    );

    for (let i = 0; i < defaultPlaylists.length; i++) {
      await db.current.updatePlaylistTracks({
        playlist_id: defaultPlaylists[i].name,
        tracks: defaultPlaylists[i].tracks,
      });
    }

    let favouriteTracks = tracks
      .filter((t) => t.favourite)
      .map((t) => t.track_id);

    await db.current.updatePlaylistTracks({
      playlist_id: PlaylistType.FAVOURITES,
      tracks: favouriteTracks,
    });

    let mostPlayedTracks = tracks
      .filter((t) => t.play_count >= 5)
      .sort((a, b) => b.play_count - a.play_count)
      .map((t) => t.track_id);

    await db.current.updatePlaylistTracks({
      playlist_id: PlaylistType.MOST_PLAYED,
      tracks: mostPlayedTracks,
    });

    let recentlyPlayedTracks = tracks
      .filter((t) => t.last_played != "0000-00-00 00:00:00")
      .sort((a, b) => new Date(b.last_played) - new Date(a.last_played))
      .slice(0, 10)
      .map((t) => t.track_id);

    await db.current.updatePlaylistTracks({
      playlist_id: PlaylistType.RECENTLY_PLAYED,
      tracks: recentlyPlayedTracks,
    });

    let playlists = await db.current.getPlaylists();
    setPlaylists(playlists);
  };

  const addPlaylist = async (playlist_id, tracks = []) => {
    try {
      if (db.current) {
        let _playlistImageIds = arrayShuffle(playlistImageIds);
        if (_playlistImageIds.length == 0) {
          _playlistImageIds = arrayShuffle(Array.from(Array(50).keys()));
        }
        let playlist_image_id = _playlistImageIds.pop();
        await db.current.insertPlaylist({
          playlist_id: playlist_id,
          playlist_image_id: playlist_image_id,
          tracks: tracks,
        });
        setPlaylistImageIds(_playlistImageIds);

        let playlists = await db.current.getPlaylists();
        setPlaylists(playlists);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const renamePlaylist = async (old_playlist_id, new_playlist_id) => {
    try {
      if (db.current) {
        await db.current.updatePlaylistId(old_playlist_id, new_playlist_id);
        let playlists = await db.current.getPlaylists();
        setPlaylists(playlists);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const deletePlaylist = async (playlist_id) => {
    try {
      if (db.current) {
        await db.current.deletePlaylist(playlist_id);
        let playlists = await db.current.getPlaylists();
        setPlaylists(playlists);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const addToPlaylist = async (playlist_ids, track_id) => {
    try {
      if (db.current) {
        for (let i = 0; i < playlist_ids.length; i++) {
          let playlist = playlists.find(
            (p) => p.playlist_id == playlist_ids[i]
          );
          if (playlist) {
            playlist.tracks.push(track_id);
            playlist.tracks = [...new Set(playlist.tracks)];
            await db.current.updatePlaylistTracks(playlist);
            let playlists = await db.current.getPlaylists();
            setPlaylists(playlists);
          }
        }
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const clearPlaylist = async (playlist_id) => {
    try {
      if (db.current) {
        let playlist = playlists.find((p) => p.playlist_id == playlist_id);
        if (playlist) {
          playlist.tracks = [];
          await db.current.updatePlaylistTracks(playlist);
          let playlists = await db.current.getPlaylists();
          setPlaylists(playlists);
        }
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const updatePlaylistImageIds = () => {
    let usedPlaylistImageIds = playlists.map((p) =>
      parseInt(p.playlist_image_id)
    );
    let _playlistImageIds = playlistImageIds.filter(
      (pi) => !usedPlaylistImageIds.includes(pi)
    );
    setPlaylistImageIds(_playlistImageIds);
  };

  const favTrack = async (track_id, favourite) => {
    if (db.current) {
      let track = tracks.find((t) => t.track_id == track_id);
      if (track) {
        track.favourite = favourite;
        await db.current.updateTrackInfo(track);
        const _tracks = await db.current.getTracksInfo();
        setTracks(_tracks);
      }
    }
  };

  const insertTrackInfo = async (track_id) => {
    if (db.current) {
      await db.current.insertTrackInfo({
        track_id: track_id,
        date_added: Date(),
      });

      const _tracks = await db.current.getTracksInfo();

      setTracks(_tracks);
    }
  };

  const updatePlayInfo = async (track_id) => {
    if (db.current) {
      let track = tracks.find((t) => t.track_id == track_id);

      if (track) {
        track.play_count++;
        track.last_played = Date();

        await db.current.updateTrackInfo(track);

        const _tracks = await db.current.getTracksInfo();

        setTracks(_tracks);
      }
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
    <DBContext.Provider value={value}>{props.children}</DBContext.Provider>
  );
};
