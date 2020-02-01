import React, { useEffect } from "react";

import { useRouter } from "next/router";
import useMatch from "../hooks/useMatch";

import Layout from "../components/layout";

import PlayerWaiting from "../components/player-waiting";
import PlayerStarted from "../components/player-started";
import PlayerFinished from "../components/player-finished";
import PlayerDisconnected from "../components/player-disconnected";

const PlayerPage = () => {
  const {
    connected,
    match,
    joinMatch,
    playerCount,
    pieces, // The Pieces on the tower
    myPieces, // The pieces that you hold
    sendPiece,
    remainingPieces
  } = useMatch();

  const router = useRouter();

  useEffect(() => {
    if (connected) {
      joinMatch(router.query.matchId);
    }
  }, [connected, router.query.matchId]);

  return (
    <Layout>
      {connected ? (
        match.started ? (
          remainingPieces > 0 ? (
            <PlayerStarted
              matchId={match.id}
              pieces={pieces}
              myPieces={myPieces}
              sendPiece={sendPiece}
              remainingPieces={remainingPieces}
            />
          ) : (
            <PlayerFinished matchId={match.id} pieces={pieces} />
          )
        ) : (
          <PlayerWaiting matchId={match.id} playerCount={playerCount} />
        )
      ) : (
        <PlayerDisconnected />
      )}
    </Layout>
  );
};

export default PlayerPage;
