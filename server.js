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

// pass the IP to client for easy development
const ip = getAddresses();

// list of the active games
const gamelist = {};

// socket.io server
io.on("connection", socket => {
  // keep track of the game/id the client is connected to
  let game, gameId;

  socket.on("new-game", reply => {
    gameId = generateId(4);
    game = { started: false, connections: [{ type: "spectator", socket }] };
    gamelist[gameId] = game;
    reply({ gameId, ip, port });
  });

  const getPlayers = () => {
    return game.connections.filter(connection => connection.type === "player");
  };

  socket.on("start-game", reply => {
    let players = getPlayers();

    if (players.length < 2) {
      reply({ error: "Need at least 2 players to start" });
      return;
    }

    game.started = true;

    const pieces = Array.from({ length: 60 }, (v, k) => k + 1);
    shuffle(pieces);
    pieces.splice(30);
    const perPlayer = Math.floor(pieces.length / players.length);

    players.forEach((player, i) => {
      const offset = i * perPlayer;
      player.socket.emit("start", {
        pieces: pieces.slice(offset, offset + perPlayer)
      });
    });

    reply({ pieces, perPlayer });
  });

  socket.on("join-game", (data, reply) => {
    let players = getPlayers();
    gameId = data.gameId;
    game = gamelist[data.gameId];
    if (game && !game.started) {
      game.connections.forEach(player => player.socket.emit("player-join"));
      game.connections.push({ type: "player", socket });
      reply({ playerCount: players.length });
    } else {
      reply({ error: "Could not join" });
    }
  });

  socket.on("disconnect", () => {
    if (!game) {
      return;
    }
    game.connections = game.connections.filter(p => p.socket !== socket);
    game.connections.forEach(player => player.socket.emit("player-leave"));
  });

  socket.on("send-piece", data => {
    game.connections.forEach(player => player.socket.emit("send-piece", data));
  });
});

nextApp.prepare().then(() => {
  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, addr, err => {
    if (err) throw err;
    console.log(`> Ready on http://${addr}:${port}`);
  });
});
