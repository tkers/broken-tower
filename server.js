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

// list of the active matches
const matchList = {};

const dealPieces = playerNum => {
  const max = 100;
  const cut = 25;

  // <cut> random numbers in range 1 to <max>
  const allPieces = Array.from({ length: max }, (v, k) => k + 1);
  shuffle(allPieces);
  allPieces.splice(cut);

  const perPlayer = Math.floor(cut / playerNum);
  const hands = Array.from({ length: playerNum }, (v, k) => {
    const offset = k * perPlayer;
    return allPieces.slice(offset, offset + perPlayer);
  });

  const total = perPlayer * playerNum;

  return { hands, total, allPieces };
};

// socket.io server
io.on("connection", socket => {
  // keep track of the match/id the client is connected to
  let match, matchId;

  const getPlayers = () => {
    return match.connections.filter(connection => connection.type === "player");
  };

  const broadcastAll = (...args) =>
    match.connections.forEach(conn => {
      if (conn.socket) {
        conn.socket.emit(...args);
      }
    });

  const getConnection = () => match.connections.find(c => c.socket === socket);

  socket.on("create-match", reply => {
    matchId = generateId(4);
    match = { started: false, connections: [{ type: "spectator", socket }] };
    matchList[matchId] = match;
    reply({ matchId, ip, port });
  });

  socket.on("start-match", () => {
    let players = getPlayers();

    if (players.length < 2) {
      // reply({ error: "Need at least 2 players to start" });
      return;
    }

    if (match.started) {
      // can not start again
      return;
    }

    match.started = true;

    const { hands, total, allPieces } = dealPieces(players.length);

    match.allPieces = allPieces;

    players.forEach((player, i) => {
      player.socket.emit("deal-pieces", { pieces: hands[i] });
    });

    broadcastAll("start", { piecesCount: total });
  });

  socket.on("restart-match", () => {
    let players = getPlayers();

    const { hands, total, allPieces } = dealPieces(players.length);

    match.allPieces = allPieces;

    players.forEach((player, i) => {
      player.socket.emit("deal-pieces", { pieces: hands[i] });
    });

    broadcastAll("restart", { piecesCount: total });
  });

  socket.on("connect-match", (data, reply) => {
    matchId = data.matchId;
    match = matchList[matchId];
    if (match) {
      match.connections.push({ type: "spectator", socket });
      const players = getPlayers();
      reply({ playerCount: players.length, started: match.started });
    } else {
      reply({ error: "Match does not exist" });
    }
  });

  socket.on("join-match", reply => {
    if (match.started) {
      reply({ error: "Match has already started" });
    } else {
      const conn = getConnection();
      conn.type = "player";
      broadcastAll("player-join");
      reply("ok");
    }
  });

  socket.on("disconnect", () => {
    if (!match) {
      return;
    }
    const conn = getConnection();
    match.connections = match.connections.filter(c => c !== conn);
    if (conn.type === "player") {
      broadcastAll("player-leave");
    }
  });

  socket.on("send-piece", size => {
    match.allPieces = match.allPieces.filter(p => p !== size);
    broadcastAll("send-piece", size);
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
