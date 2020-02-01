import React, { useEffect } from "react";
import io from "socket.io-client";

import useMatch from "../hooks/useMatch";

import Layout from "../components/layout";
import TowerWaiting from "../components/tower-waiting";
import TowerStarted from "../components/tower-started";
import TowerDisconnected from "../components/tower-disconnected";

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

  return (
    <Layout>
      {connected ? (
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
      )}
    </Layout>
  );
};

export default Home;
