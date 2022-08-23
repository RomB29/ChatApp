const mariadb = require('mariadb');

let db = null;
class DB {
  constructor() {
    // db = mariadb.createPool({
    //   user: "root",
    //   host: "localhost",
    //   password: "root",
    //   connectTimeout: 20000,
    //   database: "chat",
    // });
    db = mariadb.createConnection({
      user: "root",
      host: "localhost",
      password: "root",
      database: "chat",
    });
    // db.getConnection(function (err) {
    //   if (err) console.log(err);
    // });
  }

  addUser(data) {
    return new Promise(async (resolve, reject) => {
      if (await this.isUserExist(data)) {
        resolve(true);
      } else
        db.query(
          "INSERT INTO chat.users (name, user_id) VALUES (?,?)",
          [data.name, data.user_id],
          function (err, rows) {
            if (err) reject(new Error(err));
            else resolve(rows);
          }
        );
    });
  }
  isUserExist(data) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM chat.users WHERE name = ?",
        [data.name],
        function (err, rows) {
          if (err) reject(new Error(err));
          else resolve(rows[0]);
        }
      );
    });
  }
  fetchUserMessages(data) {
    const messages = [];
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * from messages where name =?",
        [data.name],
        function (err, rows) {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
  storeUserMessage(data) {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO messages (message, user_id, name) VALUES (?,?,?)",
        [data.message, data.user_id, data.name],
        function (err, rows) {
          if (err) reject(new Error(err));
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = DB;
