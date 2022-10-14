import SQLite from "react-native-sqlite-storage";
SQLite.enablePromise(true);

// SQLite.DEBUG(true);
export default class Database {
  initDatabase = () => {
    return new Promise((resolve, reject) => {
      SQLite.openDatabase({
        name: "my.db",
        createFromLocation: 2,
      })
        .then((DB) => {
          db = DB;
          db.transaction((tx) => {
            tx.executeSql(
              "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, savedate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, mood STRING, meta STRING, env STRING)"
            );
            resolve(DB);
          });
        })
        .catch((error) => {
          console.log(error);

          reject(handleError(error));
        });
    });
  };

  newItem = (gibberish, mood, env, date) => {
    console.log(date);
    return new Promise((resolve, reject) => {
      qry = "INSERT INTO items (text, mood, env) values (?, ?, ?)";
      vals = [gibberish, mood];
      if (typeof date != "undefined") {
        qry =
          "INSERT INTO items (text, mood, env, savedate) values (?, ?, ?, ?)";
        vals = [gibberish, mood, env, date];
      }

      this.initDatabase()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              qry,
              vals,
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

  listDate = (savedate) => {
    return new Promise((resolve, reject) => {
      this.initDatabase()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              "SELECT * FROM items WHERE date(savedate) = ?",
              [savedate],
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
              "INSERT INTO items (text, mood, savedate) values ('bad day','sad','2022-09-24 10:00:00'),('terrible day','sad','2022-09-14 10:00:00'),('yoyoy','happy','2022-09-22 10:00:00'),('rawr','angry','2022-09-22 10:00:00')",
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
