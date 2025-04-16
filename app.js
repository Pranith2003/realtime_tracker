const express = require("express");
const http = require("http");
const app = express();
const socketio = require("socket.io");
const server = http.createServer(app);
const path = require("path");
const io = socketio(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    socket.emit("recieve-location", {
      id: socket.id,
      ...data,
    });
  });

  socket.on("disconnect", () => {
    socket.emit("user-disconnect", socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3030, () => {
  console.log("listening on port: 3030");
});
