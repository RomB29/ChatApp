const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const DataBase = require("./database.js");

const db = new DataBase();

app.get("/", (req, res) => {
  res.sendFile("D:/Programmation/chat_vue3_socket_nodejs/Frontend/index.html");
});
io.on("connection", function (socket) {

  console.log("A user with ID: " + socket.id + " connected");

  socket.on("disconnect", function () {
    console.log("A user with ID: " + socket.id + " disconnected");
  });

  // More Socket listening here.
  if (io.sockets)
    socket.emit("connections", io.sockets.sockets.size);
  else socket.emit("connections", 0);

  socket.on("chat-message", async (message) => {
    const data = {
      message: message.message,
      user_id: socket.id,
      name: message.user,
    };
    await db.storeUserMessage(data);
    socket.broadcast.emit("chat-message", message);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  socket.on("stopTyping", () => {
    socket.broadcast.emit("stopTyping");
  });

  socket.on("joined", async (name) => {
    let messageData = null;
    const data = {
      name,
      user_id: socket.id,
    };
    const user = await db.addUser(data);
    if (user) {
      messageData = await db.fetchUserMessages(data);
    }
    socket.broadcast.emit("joined", messageData);
  });

  socket.on("leave", (data) => {
    socket.broadcast.emit("leave", data);
  });

});

http.listen(3000, () => {
  console.log("Listening on port *: 3000");
});