import React, { useEffect } from "react";

import { useRouter } from "next/router";
import useMatch from "../hooks/useMatch";

import Layout from "../components/layout";

import PlayerWaiting from "../components/player-waiting";
import PlayerStarted from "../components/player-started";
import PlayerDisconnected from "../components/player-disconnected";

const PlayerPage = () => {
  const {
    connected,
    match,
    joinMatch,
    playerCount,
    pieces, // The Pieces on the tower
    myPieces, // The pieces that you hold
    sendPiece
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
          <PlayerStarted
            matchId={match.id}
            pieces={pieces}
            myPieces={myPieces}
            sendPiece={sendPiece}
          />
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
