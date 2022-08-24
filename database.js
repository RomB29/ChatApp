const mariadb = require('mariadb/callback');

const db = mariadb.createConnection({
  user: "Romain",
  host: "localhost",
  password: "N3v3rFromConc3ntrat3",
  database: "chat",
});
db.connect(err => {
  if (err) {
    console.log("not connected due to error: " + err);
  } else {
    console.log("connected ! connection id is " + db.threadId);
  }
});
console.log(db);

class DB {

  
  constructor() {
    // db = mariadb.createPool({
    //   user: "root",
    //   host: "localhost",
    //   password: "root",
    //   connectTimeout: 20000,
    //   database: "chat",
    // });
    
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
          [data.name, 1],
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
        [data.message, 1, data.name],
        function (err, rows) {
          if (err) reject(new Error(err));
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = DB;
