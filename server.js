const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");

const { generateId, shuffle } = require("./utils/random.js");
const { getAddresses } = require("./utils/ip");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// address and port to listen on
const addr = dev ? "0.0.0.0" : "127.0.0.1";
const port = 3000;

// fake DB
const gamelist = {};

// pass the IP to client for easy development
const ip = getAddresses();

// socket.io server
io.on("connection", socket => {
  console.log("New socket connection");

  let game, gameId;

  socket.on("new-game", reply => {
    gameId = generateId(4);
    game = { started: false, players: [], host: socket };
    gamelist[gameId] = game;
    reply({ gameId, ip, port });
  });

  socket.on("start-game", reply => {
    if (game.players.length < 2) {
      reply({ error: "Need at least 2 players to start" });
      return;
    }

    game.started = true;

    const pieces = Array.from({ length: 60 }, (v, k) => k + 1);
    shuffle(pieces);
    pieces.splice(30);
    const perPlayer = Math.floor(pieces.length / game.players.length);

    game.players.forEach((sock, i) => {
      const offset = i * perPlayer;
      sock.emit("start", {
        pieces: pieces.slice(offset, offset + perPlayer)
      });
    });

    reply({ pieces, perPlayer });
  });

  socket.on("join-game", (data, reply) => {
    gameId = data.gameId;
    game = gamelist[data.gameId];
    if (game && !game.started) {
      game.players.forEach(sock => sock.emit("player-join"));
      game.host.emit("player-join");
      game.players.push(socket);
      reply({ playerCount: game.players.length });
    } else {
      reply({ error: "Could not join" });
    }
  });

  socket.on("disconnect", () => {
    if (game) {
      game.players = game.players.filter(p => p !== socket);
      game.players.forEach(sock => sock.emit("player-leave"));
      game.host.emit("player-leave");
    }
  });

  socket.on("send-piece", data => {
    game.players.forEach(sock => sock.emit("send-piece", data));
  });

  socket.emit("message", "Welcome!");
});

nextApp.prepare().then(() => {
  app.get("/messages", (req, res) => {
    res.json(messages);
  });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, addr, err => {
    if (err) throw err;
    console.log(`> Ready on http://${addr}:${port}`);
  });
});
