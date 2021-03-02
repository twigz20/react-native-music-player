import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlaylistType } from "../constants/constants";
import { setDBInitialized } from "../reducers/Library";
import { SQliteServices } from "../services/sqliteServices";

export const DBContext = React.createContext({
  tracks: [],
  playlists: [],
  favTrack: () => Promise.resolve(),
  updatePlayInfo: () => Promise.resolve(),
  getTrackInfo: () => null,
});

export const DBProvider = (props) => {
  const dispatch = useDispatch();
  const [tracks, setTracks] = React.useState([]);
  const [playlists, setPlaylists] = React.useState([]);
  const [isTracksLoaded, setIsTracksLoaded] = React.useState(false);
  const [isDbReady, setIsDbReady] = React.useState(false);
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

          await setDefaultPlaylists();
          dispatch(setDBInitialized());
        }
      })();
    }
  }, [isTracksLoaded, storeTracks]);

  React.useEffect(() => {
    if (db.current && db.current.isReady) {
      (async () => {
        if (isTracksLoaded) {
          await setDefaultPlaylists();
        }
      })();
    }
  }, [tracks]);

  const setDefaultPlaylists = async () => {
    let defaultPlaylists = Object.values(
      Object.keys(storePlaylists)
        .filter((key) => /^All Tracks$/.test(key))
        .reduce((playlist, key, index) => {
          playlist[index] = { name: key, tracks: storePlaylists[key] };
          return playlist;
        }, {})
    );

    for (let i = 0; i < defaultPlaylists.length; i++) {
      await db.current.updatePlaylist({
        playlist_id: defaultPlaylists[i].name,
        tracks: defaultPlaylists[i].tracks,
      });
    }

    let favouriteTracks = tracks
      .filter((t) => t.favourite)
      .map((t) => t.track_id);

    await db.current.updatePlaylist({
      playlist_id: PlaylistType.FAVOURITES,
      tracks: favouriteTracks,
    });

    let mostPlayedTracks = tracks
      .filter((t) => t.play_count >= 5)
      .sort((a, b) => b.play_count - a.play_count)
      .map((t) => t.track_id);

    await db.current.updatePlaylist({
      playlist_id: PlaylistType.MOST_PLAYED,
      tracks: mostPlayedTracks,
    });

    let recentlyPlayedTracks = tracks
      .filter((t) => t.last_played != "0000-00-00 00:00:00")
      .sort((a, b) => new Date(b.last_played) - new Date(a.last_played))
      .slice(0, 10)
      .map((t) => t.track_id);

    await db.current.updatePlaylist({
      playlist_id: PlaylistType.RECENTLY_PLAYED,
      tracks: recentlyPlayedTracks,
    });

    let playlists = await db.current.getPlaylists();
    setPlaylists(playlists);
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
  };

  return (
    <DBContext.Provider value={value}>{props.children}</DBContext.Provider>
  );
};
