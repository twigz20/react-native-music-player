import DefaultPlaylistData from "../data/playlist_images/default_playlists.json";

export class DatabaseInitialization {
  // Perform updates to the database schema
  async updateDatabaseTables(database) {
    let dbVersion = 0;
    console.log("Beginning database updates...");

    // First: create tables if they do not already exist
    return database
      .transaction(this.createTables) // this.createTables is a reference to a function below
      .then(() => {
        // Get the current database version
        return this.getDatabaseVersion(database);
      })
      .then(async (version) => {
        dbVersion = version;
        console.log("Current database version is: " + dbVersion);

        // Perform DB updates based on this version
        if (dbVersion < 1) {
          await this.setDefaultPlaylists(database);
          // Uncomment the next line, and include the referenced function below, to enable this
          return database.transaction(this.preVersion1Inserts);
        }
        // otherwise,
        return;
      })
      .then(() => {
        if (dbVersion < 2) {
          // Uncomment the next line, and the referenced function below, to enable this
          // return database.transaction(this.preVersion2Inserts);
        }
        // otherwise,
        return;
      });
  }

  // Perform initial setup of the database tables
  createTables(transaction) {
    // DANGER! For dev only
    const dropAllTables = false;
    if (dropAllTables) {
      transaction.executeSql("DROP TABLE IF EXISTS echo_tracks;");
      transaction.executeSql("DROP TABLE IF EXISTS echo_playlists;");
      transaction.executeSql("DROP TABLE IF EXISTS Version;");
    }

    // Tracks table
    transaction.executeSql(
      `
      CREATE TABLE IF NOT EXISTS echo_tracks (
        seq INTEGER PRIMARY KEY AUTOINCREMENT,
        track_id int(11) NOT NULL,
        favourite tinyint(1) NOT NULL DEFAULT 0,
        play_count int(11) NOT NULL DEFAULT 0,
        last_played datetime NOT NULL DEFAULT "0000-00-00 00:00:00",
        date_added datetime NOT NULL
      )
      `
    );

    // Playlists table
    transaction.executeSql(
      `
      CREATE TABLE IF NOT EXISTS echo_playlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playlist_id int(11) NOT NULL,
        playlist_image_id varchar(255) NOT NULL,
        tracks json
      )
      `
    );

    // Version table
    transaction.executeSql(
      "CREATE TABLE IF NOT EXISTS Version( " +
        "version_id INTEGER PRIMARY KEY NOT NULL, " +
        "version INTEGER" +
        ");"
    );
  }

  async setDefaultPlaylists(database) {
    let [results] = await database.executeSql("SELECT * FROM echo_playlists");
    if (results.rows && results.rows.length == 0) {
      for (let i = 0; i < DefaultPlaylistData.length; i++) {
        await database.executeSql(
          "INSERT INTO echo_playlists (playlist_id, playlist_image_id, tracks) VALUES (?, ?, ?)",
          [
            DefaultPlaylistData[i].playlist_id,
            DefaultPlaylistData[i].playlist_image_id,
            JSON.stringify(DefaultPlaylistData[i].tracks),
          ]
        );
        console.log(i);
      }
    }
  }

  // Get the version of the database, as specified in the Version table
  async getDatabaseVersion(database) {
    // Select the highest version number from the version table
    return database
      .executeSql("SELECT version FROM Version ORDER BY version DESC LIMIT 1;")
      .then(([results]) => {
        if (results.rows && results.rows.length > 0) {
          const version = results.rows.item(0).version;
          return version;
        } else {
          return 0;
        }
      })
      .catch((error) => {
        console.log(`No version set. Returning 0. Details: ${error}`);
        return 0;
      });
  }

  // Once the app has shipped, use the following functions as a template for updating the database:
  // This function should be called when the version of the db is < 1
  preVersion1Inserts(transaction) {
    console.log("Running pre-version 1 DB inserts");
    // Make schema changes
    // transaction.executeSql("ALTER TABLE ...");
    // Lastly, update the database version
    transaction.executeSql("INSERT INTO Version (version) VALUES (1);");
  }
  /*
    
    // This function should be called when the version of the db is < 2
    private preVersion2Inserts(transaction: SQLite.Transaction) {
        console.log("Running pre-version 2 DB inserts");
        
        // Make schema changes
        transaction.executeSql("ALTER TABLE ...");
        // Lastly, update the database version
        transaction.executeSql("INSERT INTO Version (version) VALUES (2);");
    }
    */
}
