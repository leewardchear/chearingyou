import SQLite from "react-native-sqlite-storage";
SQLite.enablePromise(true);

// SQLite.DEBUG(true);
export default class Database {
  initDatabase = () => {
    return new Promise((resolve, reject) => {
      SQLite.openDatabase({
        name: "my.db",
        createFromLocation: "./assets/db/chearingyou.db",
      })
        .then((DB) => {
          db = DB;
          db.transaction((tx) => {
            tx.executeSql(
              "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, count INT)"
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

  newItem = (gibberish) => {
    return new Promise((resolve, reject) => {
      this.initDatabase()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              "INSERT INTO items (text, count) values (?, ?)",
              [gibberish, 0],
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
                console.log(resultSet.rows.item(1).text);
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
