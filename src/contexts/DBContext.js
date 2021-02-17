import React from "react";
import { useSelector } from "react-redux";
import { SQliteServices } from "../services/sqliteServices";

export const DBContext = React.createContext({
  tracks: [],
  favTrack: () => Promise.resolve(),
  updatePlayInfo: () => Promise.resolve(),
  getTrackInfo: () => null,
});

export const DBProvider = (props) => {
  const [tracks, setTracks] = React.useState([]);
  const [isTracksLoaded, setIsTracksLoaded] = React.useState(false);
  const [isDbReady, setIsDbReady] = React.useState(false);
  const db = React.useRef(null);

  const { tracks: storeTracks } = useSelector((state) => state.Library);

  React.useEffect(() => {
    db.current = new SQliteServices();
    db.current.init().then(() => {
      setIsDbReady(true);
    });
  }, []);

  React.useEffect(() => {
    if (db.current && db.current.isReady) {
      (async () => {
        if (db.current) {
          const _tracks = await db.current.getTracksInfo();
          setTracks(_tracks);
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
            } else {
              console.log("Skipped: ", storeTracks[i].id);
            }
          }

          if (newTracksAdded) {
            const _tracks = await db.current.getTracksInfo();
            setTracks(_tracks);
          }
        }
      })();
    }
  }, [isTracksLoaded, storeTracks]);

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
    favTrack,
    updatePlayInfo,
    getTrackInfo,
  };

  return (
    <DBContext.Provider value={value}>{props.children}</DBContext.Provider>
  );
};
