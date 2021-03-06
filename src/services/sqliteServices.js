import SQLite from "react-native-sqlite-storage";
import { TrackModel } from "../models/TrackModel";
import DefaultPlaylistData from "../data/playlist_images/default_playlists.json";

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
      CREATE TABLE IF NOT EXISTS echo_playlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playlist_id int(11) NOT NULL,
        playlist_image_id varchar(255) NOT NULL,
        tracks json
      )
      `,
        []
      );

      await this.setupDefaultPlaylists();

      this.isReady = true;

      console.log("SQlite database connect");
    } catch (error) {
      console.log("SQlite database error: ", error);
    }
  }

  async setupDefaultPlaylists() {
    try {
      const [results] = await this._db.executeSql(
        "SELECT * FROM echo_playlists",
        []
      );

      if (results.rows.length <= 0) {
        for (let i = 0; i < DefaultPlaylistData.length; i++) {
          await this.insertPlaylist(DefaultPlaylistData[i]);
        }
      } else {
        return;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  insertPlaylist(_playlist) {
    return new Promise((resolve, reject) => {
      this._db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO echo_playlists (playlist_id, playlist_image_id, tracks) VALUES (?, ?, ?)",
          [
            _playlist.playlist_id,
            _playlist.playlist_image_id,
            JSON.stringify(_playlist.tracks),
          ],
          () => {
            console.log(`Playlist Inserted: ${_playlist.playlist_id}`);
            resolve();
          },
          (error) => {
            console.log(
              `Playlist Failed to Insert: ${_playlist.playlist_id}`,
              error
            );
            reject(error);
          }
        );
      });
    });
  }

  deletePlaylist(playlist_id) {
    return new Promise((resolve, reject) => {
      this._db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM echo_playlists WHERE playlist_id = ?",
          [playlist_id],
          () => {
            console.log(`Playlist Deleted: ${playlist_id}`);
            resolve();
          },
          (error) => {
            console.log(`Playlist Failed to Delete: ${playlist_id}`, error);
            reject(error);
          }
        );
      });
    });
  }

  updatePlaylistTracks(_playlist) {
    return new Promise((resolve, reject) => {
      this._db.transaction((tx) => {
        tx.executeSql(
          "UPDATE echo_playlists SET tracks = ? WHERE playlist_id = ?",
          [JSON.stringify(_playlist.tracks), _playlist.playlist_id],
          () => {
            resolve();
          },
          (error) => {
            console.log(
              `Playlist Failed to Update: ${_playlist.playlist_id}`,
              error
            );
            reject(error);
          }
        );
      });
    });
  }

  updatePlaylistId(old_playlist_id, new_playlist_id) {
    return new Promise((resolve, reject) => {
      this._db.transaction((tx) => {
        tx.executeSql(
          "UPDATE echo_playlists SET playlist_id = ? WHERE playlist_id = ?",
          [new_playlist_id, old_playlist_id],
          () => {
            resolve();
          },
          (error) => {
            console.log(
              `Playlist Failed to Update: ${_playlist.playlist_id}`,
              error
            );
            reject(error);
          }
        );
      });
    });
  }

  async getPlaylists() {
    const playlists = [];
    try {
      const [results] = await this._db.executeSql(
        "SELECT * FROM echo_playlists",
        []
      );
      for (let i = 0; i < results.rows.length; i++) {
        const row = results.rows.item(i);
        row.tracks = JSON.parse(row.tracks);
        playlists.push(row);
      }
    } catch (error) {
      console.warn(error);
    }
    return playlists;
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
