import * as types from "./types";
import { SQliteServices } from "../../services/sqliteServices";
import { useRef } from "react";

// const [tracks, setTracks] = React.useState([]);
//   const [isDbReady, setIsDbReady] = React.useState(false);
//   const db = React.useRef(null);

//   React.useEffect(() => {
//     db.current = new SQliteServices();
//     db.current.init().then(() => setIsDbReady(true));
//   }, []);

//   React.useEffect(() => {
//     if (db.current && db.current.isReady) {
//       (async () => {
//         if (db.current) {
//           const _tracks = await db.current.getTracksInfo();
//           setTracks(_tracks);
//         }
//       })();
//     }
//   }, [isDbReady]);

export const initDb = () => {
  return async (dispatch) => {
    let init = false;
    const db = useRef(null);
    db.current = new SQliteServices();
    try {
      await db.current.init();
      init = true;
    } catch (error) {
      console.log("DB Init Error: ", error);
    }
    dispatch({
      type: types.INIT,
      payload: {
        init,
        db: db.current,
      },
    });
  };
};

export const adjustDbTrackInfo = (currentTracks) => {
  return async (dispatch, getState) => {
    // const { db, init } = getState().DB;
    // if (init) {
    //   // const _tracks = await db.getTracksInfo();
    //   console.log(db);
    // }
    // console.log(tracks, init);
    // const dbContext = useContext(DBContext);
    // console.log(dbTracks);
    // fetch("http://192.168.1.113:8161/tracks", {
    //   method: "GET",
    // })
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     dispatch({
    //       type: types.GET_PLAYLIST,
    //       payload: responseJson,
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };
};
