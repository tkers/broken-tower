import React, { useEffect } from "react";

import { useRouter } from "next/router";
import useMatch from "../hooks/useMatch";
import useCountdown from "../hooks/useCountdown";

import Layout from "../components/layout";
import TowerWaiting from "../components/tower-waiting";
import TowerStarted from "../components/tower-started";
import TowerFinished from "../components/tower-finished";
import TowerDisconnected from "../components/tower-disconnected";

const Home = () => {
  const {
    connected,
    createMatch,
    spectateMatch,
    startMatch,
    restartMatch,
    match,
    playerCount,
    pieces,
    remainingPieces,
    address
  } = useMatch();

  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      return;
    }

    if (router.query.matchId) {
      spectateMatch(router.query.matchId);
    } else {
      createMatch();
    }
  }, [connected, router.query.matchId]);

  const { start, stop, time } = useCountdown(() => startMatch());

  useEffect(() => {
    if (playerCount >= 2 && match.host) {
      start(30);
    } else {
      stop();
    }
  }, [playerCount, match.host]);

  const onStart = () => {
    stop();
    startMatch();
  };

  return (
    <Layout>
      {connected ? (
        match.started ? (
          remainingPieces > 0 ? (
            <TowerStarted
              matchId={match.id}
              playerCount={playerCount}
              pieces={pieces}
              remainingPieces={remainingPieces}
            />
          ) : (
            <TowerFinished
              matchId={match.id}
              playerCount={playerCount}
              pieces={pieces}
              restartMatch={restartMatch}
            />
          )
        ) : (
          <TowerWaiting
            matchId={match.id}
            playerCount={playerCount}
            countdown={time}
            onStart={onStart}
            ip={address.ip}
            port={address.port}
          />
        )
      ) : (
        <TowerDisconnected />
      )}
    </Layout>
  );
};

export default Home;
