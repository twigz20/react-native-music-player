import SQLite from "react-native-sqlite-storage";
import { DatabaseInitialization } from "./DatabaseInitialization";
import { DATABASE } from "./Constants";
import { PlaylistType } from "../constants/constants";
import arrayShuffle from "array-shuffle";

class Database {
  // Open the connection to the database
  async open() {
    SQLite.DEBUG(false);
    SQLite.enablePromise(true);
    let databaseInstance;

    return SQLite.openDatabase({
      name: DATABASE.FILE_NAME,
      location: "default",
    })
      .then((db) => {
        databaseInstance = db;
        console.log("[db] Database open!");

        // Perform any database initialization or updates, if needed
        const databaseInitialization = new DatabaseInitialization();
        return databaseInitialization.updateDatabaseTables(databaseInstance);
      })
      .then(() => {
        this.database = databaseInstance;
        return databaseInstance;
      });
  }

  // Close the connection to the database
  async close() {
    if (this.database === undefined) {
      return Promise.reject("[db] Database was not open; unable to close.");
    }
    return this.database.close().then((status) => {
      console.log("[db] Database closed.");
      this.database = undefined;
    });
  }

  // Playlist
  async addPlaylist(playlist) {
    return this.getDatabase()
      .then((db) =>
        db.executeSql(
          "INSERT INTO echo_playlists (playlist_id, playlist_image_id, tracks) VALUES (?, ?, ?)",
          [
            playlist.playlist_id,
            playlist.playlist_image_id,
            JSON.stringify(playlist.tracks),
          ]
        )
      )
      .catch((error) => {
        console.log(
          `Playlist Failed to Insert: ${playlist.playlist_id}`,
          error
        );
      });
  }

  async deletePlaylist(playlist_id) {
    return this.getDatabase()
      .then((db) =>
        db.executeSql("DELETE FROM echo_playlists WHERE playlist_id = ?", [
          playlist_id,
        ])
      )
      .catch((error) => {
        console.log(`Playlist Failed to Delete: ${playlist_id}`, error);
      });
  }

  async updatePlaylistTracks(_playlist) {
    return this.getDatabase()
      .then((db) =>
        db.executeSql(
          "UPDATE echo_playlists SET tracks = ? WHERE playlist_id = ?",
          [JSON.stringify(_playlist.tracks), _playlist.playlist_id]
        )
      )
      .catch((error) => {
        console.log(
          `Playlist Failed to Update: ${_playlist.playlist_id}`,
          error
        );
      });
  }

  async renamePlaylist(old_playlist_id, new_playlist_id) {
    return this.getDatabase()
      .then((db) =>
        db.executeSql(
          "UPDATE echo_playlists SET playlist_id = ? WHERE playlist_id = ?",
          [new_playlist_id, old_playlist_id]
        )
      )
      .catch((error) => {
        console.log(
          `Playlist Failed to Update: ${_playlist.playlist_id}`,
          error
        );
      });
  }

  async getPlaylist(playlist_id) {
    return this.getDatabase()
      .then((db) =>
        db.executeSql("SELECT * FROM echo_playlists WHERE playlist_id = ?", [
          playlist_id,
        ])
      )
      .then(([results]) => {
        if (results === undefined) {
          return {};
        }
        const count = results.rows.length;
        if (results.rows && results.rows.length > 0) {
          const playlist = results.rows.item(0);
          return playlist;
        } else {
          return {};
        }
      });
  }

  async getPlaylists() {
    return this.getDatabase()
      .then((db) => db.executeSql("SELECT * FROM echo_playlists"))
      .then(([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const playlists = [];
        for (let i = 0; i < results.rows.length; i++) {
          const row = results.rows.item(i);
          row.tracks = JSON.parse(row.tracks);
          playlists.push(row);
        }
        return playlists;
      });
  }

  async initPlaylistInfo(tracksInfo) {
    let playlists = await database.getPlaylists();

    let allTracksPlaylist = playlists.find(
      (p) => p.playlist_id == PlaylistType.ALL
    );

    allTracksPlaylist.tracks = tracksInfo.map((t) => t.track_id);

    await database.updatePlaylistTracks(allTracksPlaylist);

    let favouritesPlaylist = playlists.find(
      (p) => p.playlist_id == PlaylistType.FAVOURITES
    );

    favouritesPlaylist.tracks = tracksInfo
      .filter((t) => t.favourite)
      .map((t) => t.track_id);

    await database.updatePlaylistTracks(favouritesPlaylist);

    let mostPlayedPlaylist = playlists.find(
      (p) => p.playlist_id == PlaylistType.MOST_PLAYED
    );

    mostPlayedPlaylist.tracks = tracksInfo
      .filter((t) => t.play_count >= 5)
      .sort((a, b) => b.play_count - a.play_count)
      .map((t) => t.track_id);

    await database.updatePlaylistTracks(mostPlayedPlaylist);

    let recentlyPlayedPlaylist = playlists.find(
      (p) => p.playlist_id == PlaylistType.RECENTLY_PLAYED
    );

    recentlyPlayedPlaylist.tracks = tracksInfo
      .filter((t) => t.last_played != "0000-00-00 00:00:00")
      .sort((a, b) => new Date(b.last_played) - new Date(a.last_played))
      .slice(0, 10)
      .map((t) => t.track_id);

    await database.updatePlaylistTracks(recentlyPlayedPlaylist);
  }

  // Track
  async getTrackInfo(track_id) {
    return this.getDatabase()
      .then((db) =>
        db.executeSql("SELECT * FROM echo_tracks WHERE track_id = ?", [
          track_id,
        ])
      )
      .then(([results]) => {
        if (results === undefined) {
          return {};
        }
        if (results.rows && results.rows.length > 0) {
          const trackInfo = results.rows.item(0);
          return trackInfo;
        } else {
          return {};
        }
      });
  }

  async getTracksInfo() {
    return this.getDatabase()
      .then((db) => db.executeSql("SELECT * FROM echo_tracks"))
      .then(([results]) => {
        if (results === undefined) {
          return [];
        }
        const count = results.rows.length;
        const tracks = [];
        for (let i = 0; i < results.rows.length; i++) {
          const row = results.rows.item(i);

          tracks.push({
            seq: row.seq,
            track_id: row.track_id,
            favourite: row.favourite,
            play_count: row.play_count,
            date_added: row.date_added,
            last_played: row.last_played,
          });
        }
        return tracks;
      });
  }

  async initTracksInfo(tracks) {
    let tracksInfo = await this.getTracksInfo();

    if (tracks.length != tracksInfo.length) {
      for (let i = 0; i < tracks.length; i++) {
        if (!tracksInfo.includes(tracks[i].id)) {
          await this.insertTrackInfo({
            track_id: tracks[i].id,
            date_added: Date(),
          });
          console.log("Adding Track");
        } else {
          console.log("Skipping Track");
        }
      }
    }
  }

  async insertTrackInfo(track) {
    return this.getDatabase()
      .then((db) =>
        db.executeSql(
          "INSERT INTO echo_tracks (track_id, date_added) VALUES (?, ?)",
          [track.track_id, track.date_added]
        )
      )
      .catch((error) => {
        console.log(`Track Failed to Insert: ${track.track_id}`, error);
      });
  }

  async updateTrackInfo(track) {
    return this.getDatabase()
      .then((db) =>
        db.executeSql(
          "UPDATE echo_tracks SET favourite = ?, play_count = ?, last_played = ? WHERE track_id = ?",
          [track.favourite, track.play_count, track.last_played, track.track_id]
        )
      )
      .catch((error) => {
        console.log(`Track Failed to Insert: ${track.track_id}`, error);
      });
  }

  async getDatabase() {
    if (this.database !== undefined) {
      return Promise.resolve(this.database);
    }
    // otherwise: open the database first
    return this.open();
  }
}

// Export a single instance of DatabaseImpl
export const database = new Database();
