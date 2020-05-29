const app = require("./index");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const port = 3001;
const io = socketio(server);
const {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
} = require("./router/users");
io.on("connection", (socket) => {
  console.log("a user connected");

  // lisitning to join event
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    // creating event
    socket.emit("message", {
      user: "admin",
      text: `${user.name},welcome to the room ${user.room}`,
    });
    // brodacasting all user who are in chat
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name},has joined`,
    });

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });
    callback();
  });

  // message coming from front-end
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message });

    io.to(user.room).emit("roomData", { room: user.name, text: message });
    console.log("msg from client ", message);
    callback();
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left`,
      });
    }
  });
});
server.listen(port, (req, res) => {
  console.log("server is listining at port ", port);
  //res.send("All gud");
});
