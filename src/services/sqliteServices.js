import SQLite from "react-native-sqlite-storage";
import { TrackModel } from "../models/TrackModel";

export class SQliteServices {
  constructor() {
    this.isReady = false;
  }

  init() {
    return new Promise((resolve, reject) => {
      this._db = SQLite.openDatabase(
        {
          name: "echo.db",
          location: "Documents",
        },
        async () => {
          console.log("sQlite database connect");

          await this._db.executeSql(
            `
          CREATE TABLE IF NOT EXISTS echo_tracks (
            seq INTEGER PRIMARY KEY AUTOINCREMENT,
            track_id int(11) NOT NULL,
            favourite tinyint(1) NOT NULL DEFAULT 0,
            play_count int(11) NOT NULL DEFAULT 0,
            last_played datetime NOT NULL DEFAULT "0000-00-00 00:00:00",
            date_added datetime NOT NULL
          )
          `,
            [],
            (tx, results) => {},
            (error) => {
              console.log("Create Table Error: ", error);
              reject(error);
            }
          );

          this.isReady = true;
          resolve();
        },
        (error) => {
          console.log("SQLite database error", error);
          reject();
        }
      );
    });
  }

  getTracksInfo() {
    return new Promise((resolve, reject) => {
      const tracks = [];
      this._db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM echo_tracks",
          [],
          (tx, results) => {
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);

              tracks.push(
                new TrackModel({
                  seq: row.seq,
                  track_id: row.track_id,
                  favourite: row.favourite,
                  play_count: row.play_count,
                  date_added: row.date_added,
                  last_played: row.last_played,
                })
              );
            }
            resolve(tracks);
          },
          (error) => {
            console.log("getTracksInfo Error: ", error);
            reject(error);
          }
        );
      });
    });
  }

  insertTrackInfo(track) {
    return new Promise((resolve, reject) => {
      this._db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO echo_tracks (track_id, date_added) VALUES (?, ?)",
          [track.track_id, track.date_added],
          () => {
            console.log(`Track Inserted: ${track.track_id}`);
            resolve();
          },
          (error) => {
            console.log(`Track Failed to Insert: ${track.track_id}`, error);
            reject(error);
          }
        );
      });
    });
  }

  updateTrackInfo(track) {
    return new Promise((resolve, reject) => {
      this._db.transaction((tx) => {
        tx.executeSql(
          "UPDATE echo_tracks SET favourite = ?, play_count = ?, last_played = ? WHERE track_id = ?",
          [
            track.favourite,
            track.play_count,
            track.last_played,
            track.track_id,
          ],
          () => {
            console.log(track);
            console.log(`Track Info Updated: ${track.track_id}`);
            resolve();
          },
          (error) => {
            console.log(`Track Failed to Update: ${track.track_id}`, error);
            reject(error);
          }
        );
      });
    });
  }
}
