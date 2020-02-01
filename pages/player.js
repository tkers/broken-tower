import React, { useEffect } from "react";

import { useRouter } from "next/router";
import useMatch from "../hooks/useMatch";

import PlayerWaiting from "../components/player-waiting";
import PlayerStarted from "../components/player-started";
import PlayerDisconnected from "../components/player-disconnected";

const PlayerPage = () => {
  const {
    connected,
    match,
    joinMatch,
    playerCount,
    myPieces,
    sendPiece
  } = useMatch();

  const router = useRouter();

  useEffect(() => {
    if (connected) {
      joinMatch(router.query.matchId);
    }
  }, [connected, router.query.matchId]);

  return connected ? (
    match.started ? (
      <PlayerStarted
        matchId={match.id}
        pieces={myPieces}
        sendPiece={sendPiece}
      />
    ) : (
      <PlayerWaiting matchId={match.id} playerCount={playerCount} />
    )
  ) : (
    <PlayerDisconnected />
  );
};

export default PlayerPage;
