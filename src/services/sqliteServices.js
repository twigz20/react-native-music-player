import SQLite from "react-native-sqlite-storage";
import { TrackModel } from "../models/TrackModel";
import PlaylistImages from "../data/playlist_images.json";

export class SQliteServices {
  constructor() {
    this.isReady = false;
    SQLite.enablePromise(true);
  }

  async init() {
    try {
      this._db = await SQLite.openDatabase({
        name: "echo.db",
        location: "Documents",
      });
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
        []
      );
      await this._db.executeSql(
        `
      CREATE TABLE IF NOT EXISTS echo_playlist_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pixabay_id int(11) NOT NULL,
        preview varchar(255) NOT NULL,
        image varchar(255) NOT NULL
      )
      `,
        []
      );

      this.isReady = true;

      const _playlistImages = await this.getPlaylistImages();
      await this.insertPlaylistImages(_playlistImages);
      console.log("SQlite database connect");
    } catch (error) {
      console.log("SQlite database error: ", error);
    }
  }

  insertPlaylistImages(_playlistImages) {
    return new Promise((resolve, reject) => {
      try {
        for (let i = 0; i < PlaylistImages.length; i++) {
          if (
            _playlistImages
              .map((pI) => pI.pixabay_id)
              .includes(PlaylistImages[i].id)
          ) {
            continue;
          }
          this._db.transaction(async (tx) => {
            await tx.executeSql(
              "INSERT INTO echo_playlist_images (pixabay_id, preview, image) VALUES (?, ?, ?)",
              [
                PlaylistImages[i].id,
                PlaylistImages[i].preview,
                PlaylistImages[i].image,
              ]
            );
          });
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  getPlaylistImages() {
    return new Promise((resolve, reject) => {
      const playlistImages = [];
      this._db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM echo_playlist_images",
          [],
          (tx, results) => {
            for (let i = 0; i < results.rows.length; i++) {
              const row = results.rows.item(i);
              playlistImages.push(row);
            }
            resolve(playlistImages);
          },
          (error) => {
            console.log("getPlaylistImages Error: ", error);
            reject(error);
          }
        );
      });
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
