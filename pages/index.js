import React, { useEffect } from "react";
import io from "socket.io-client";

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
    startMatch,
    match,
    playerCount,
    pieces,
    remainingPieces,
    address
  } = useMatch();

  useEffect(() => {
    if (connected) {
      createMatch();
    }
  }, [connected]);

  const { start, stop, time } = useCountdown(() => startMatch());

  useEffect(() => {
    if (playerCount >= 2) {
      start(30);
    } else {
      stop();
    }
  }, [playerCount]);

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
            />
          )
        ) : (
          <TowerWaiting
            matchId={match.id}
            playerCount={playerCount}
            countdown={time}
            onStart={startMatch}
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
