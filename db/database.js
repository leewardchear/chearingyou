import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true)
SQLite.enablePromise(true);

// SQLite.DEBUG(true);
export default class Database {
  initDatabase = () => {
    return new Promise((resolve, reject) => {
      SQLite.openDatabase({
        name: "my.db",
        // createFromLocation: "./assets/db/chearingyou.db",
      })
        .then((DB) => {
          db = DB;
          db.transaction((tx) => {
            tx.executeSql(
              "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, mood STRING, meta STRING)"
            );
            resolve(DB);
          });
        })
        .catch((error) => {
          console.log("ERROR: " + error);

          reject(handleError(error))
        });
    }).catch((error) =>{
      reject(error)

    });
  };

  newItem = (gibberish, mood) => {
    return new Promise((resolve, reject) => {
      this.initDatabase()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              "INSERT INTO items (text, mood) values (?, ?)",
              [gibberish, mood],
              (txObj, resultSet) => {
                resolve(resultSet);
                console.log(resultSet);
              },
              (txObj, error) => {
                console.log("Error", error);
                reject(error);
              }
            );
          });
        })
        .catch((error) => console.error(error));
    });
  };

  listItems = () => {
    return new Promise((resolve, reject) => {
      this.initDatabase()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              "SELECT * FROM items",
              [],
              (txObj, resultSet) => {
                resolve(resultSet);
              },
              (txObj, error) => {
                console.log("Error", error);
                reject(error);
              }
            );
          });
        })
        .catch((error) => console.error(error));
    });
  };
  fakeData = (gibberish, mood) => {
    return new Promise((resolve, reject) => {
      this.initDatabase()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              "INSERT INTO items (text, mood, date) values ('bad day','sad','2022-09-24 10:00:00'),('terrible day','sad','2022-09-14 10:00:00'),('yoyoy','happy','2022-09-22 10:00:00'),('rawr','angry','2022-09-22 10:00:00')",
              [],
              (txObj, resultSet) => {
                resolve(txObj);
                console.log(resultSet);
              },
              (txObj, error) => {
                console.log("Error", error);
                reject(error);
              }
            );
          });
        })

        .catch((error) => console.error(error));
    });
  };

  deleteAll = () => {
    return new Promise((resolve, reject) => {
      this.initDatabase()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              "DELETE FROM items",
              [],
              (txObj, resultSet) => {
                resolve(resultSet);
              },
              (txObj, error) => {
                console.log("Error", error);
                reject(error);
              }
            );
          });
        })
        .catch((error) => console.error(error));
    });
  };
}
