import React, { useEffect, useState, useReducer, useRef } from "react";
import io from "socket.io-client";

import TowerWaiting from "../components/tower-waiting";
import TowerStarted from "../components/tower-started";
import TowerDisconnected from "../components/tower-disconnected";

const useMatch = () => {
  const [match, setMatch] = useState({ started: false, id: null });
  const [address, setAddress] = useState({ ip: null, port: null });

  const socket = useRef();
  const [connected, setConnected] = useState(false);
  const [playerCount, addPlayerCount] = useReducer(
    (total, delta) => total + delta,
    0
  );
  const [pieces, addPiece] = useReducer(
    (pieces, newPiece) => [...pieces, newPiece],
    []
  );

  useEffect(() => {
    const sock = io();

    sock.on("connect", () => {
      setConnected(true);
    });

    sock.on("disconnect", () => {
      setConnected(false);
    });

    sock.on("player-join", () => {
      addPlayerCount(1);
    });

    sock.on("player-leave", () => {
      addPlayerCount(-1);
    });

    sock.on("send-piece", size => {
      addPiece(size);
    });

    socket.current = sock;

    return () => {
      socket.current && socket.current.close();
    };
  }, []);

  const createMatch = () => {
    socket.current.emit("create-match", data => {
      setMatch({ id: data.matchId, started: false });
      setAddress({ ip: data.ip, port: data.port });
    });
  };

  const startMatch = () => {
    socket.current.emit("start-match", data => {
      if (data.error) {
        alert(data.error);
      } else {
        console.log("Match started!", data);
        setMatch({ ...match, started: true });
      }
    });
  };

  return {
    connected,
    match,
    createMatch,
    startMatch,
    playerCount,
    pieces,
    address
  };
};

const Home = () => {
  const {
    connected,
    createMatch,
    startMatch,
    match,
    playerCount,
    pieces,
    address
  } = useMatch();

  useEffect(() => {
    if (connected) {
      createMatch();
    }
  }, [connected]);

  return connected ? (
    match.started ? (
      <TowerStarted
        matchId={match.id}
        playerCount={playerCount}
        pieces={pieces}
      />
    ) : (
      <TowerWaiting
        matchId={match.id}
        playerCount={playerCount}
        onStart={startMatch}
        ip={address.ip}
        port={address.port}
      />
    )
  ) : (
    <TowerDisconnected />
  );
};

export default Home;
