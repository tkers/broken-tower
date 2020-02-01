import React, { useEffect, useState, useReducer } from "react";
import useSocket from "../hooks/useSocket";

const useMatch = () => {
  const [match, setMatch] = useState({
    started: false,
    id: null
  });
  const [address, setAddress] = useState({ ip: null, port: null });

  const [playerCount, addPlayerCount] = useReducer(
    (total, delta) => total + delta,
    0
  );
  const [pieces, setPiece] = useState([]);
  const [myPieces, setMyPieces] = useState([]);

  const [remainingPieces, addRemainingPieces] = useReducer(
    (total, delta) => total + delta,
    0
  );

  const { socket, connected } = useSocket();

  const onPlayerJoin = () => {
    console.log("player joined")
    addPlayerCount(1);
  };

  const onPlayerLeave = () => {
    console.log("player left")
    addPlayerCount(-1);
  };

  const onSendPiece = size => {
    setPiece(pieces =>[...pieces, size]);
    addRemainingPieces(-1);
  };

  const onDealPieces = data => {
    const myPieces = data.pieces;
    data.pieces.sort((a, b) => b - a);
    setMyPieces(myPieces);
  };

  const onMatchStarted = data => {
    console.log("match started")
    setMatch({ ...match, started: true });
    addRemainingPieces(data.piecesCount);
  };

  const onMatchRestarted = data => {
    console.log("match re-started")
    setMatch({ ...match, started: true });
    setPiece([])
    addRemainingPieces(-remainingPieces + data.piecesCount);
  };

  useEffect(() => {
    if (!socket.current) {
      return;
    }

    socket.current.on("player-join", onPlayerJoin);
    socket.current.on("player-leave", onPlayerLeave);
    socket.current.on("send-piece", onSendPiece);
    socket.current.on("deal-pieces", onDealPieces);
    socket.current.on("start", onMatchStarted);
    socket.current.on("restart", onMatchRestarted);

    return () => {
      if (!socket.current) {
        return;
      }

      socket.current.removeListener("player-join", onPlayerJoin);
      socket.current.removeListener("player-leave", onPlayerLeave);
      socket.current.removeListener("send-piece", onSendPiece);
      socket.current.removeListener("deal-pieces", onDealPieces);
      socket.current.removeListener("start", onMatchStarted);
      socket.current.removeListener("restart", onMatchRestarted);
    };
  }, [socket.current]);

  const createMatch = () => {
    socket.current.emit("create-match", data => {
      setMatch({ id: data.matchId, started: false });
      setAddress({ ip: data.ip, port: data.port });
    });
  };

  const startMatch = () => {
    socket.current.emit("start-match");
  };

  const restartMatch = () => {
    console.log("emit restart match")
    socket.current.emit("restart-match");
  };

  const sendPiece = () => {
    if (myPieces.length) {
      const biggerPiece = Math.max(...myPieces);
      socket.current.emit("send-piece", biggerPiece);
      setMyPieces(myPieces.filter(p => p !== biggerPiece));
    }
  };

  const joinMatch = matchId => {
    socket.current.emit("connect-match", { matchId }, data => {
      if (data.error) {
        console.log(data.error);
        return;
      }

      setMatch({
        id: matchId,
        started: data.started
      });

      addPlayerCount(data.playerCount);

      socket.current.emit("join-match", res => {
        if (res.error) {
          console.log(res.error);
        }
      });
    });
  };

  return {
    connected,
    match,
    createMatch,
    startMatch,
    restartMatch,
    playerCount,
    joinMatch,
    sendPiece,
    pieces,
    myPieces,
    remainingPieces,
    address
  };
};

export default useMatch;
