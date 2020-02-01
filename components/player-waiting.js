import React from "react";
import Head from "next/head";
import Nav from "./nav";

const PlayerWaiting = ({ gameId, playerCount }) => (
  <div>
    <Head>
      <title>Player</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <div>
      Waiting for other players...
      <br />
      Game ID: {gameId}
      <br />
      Player Count:{playerCount}
    </div>
  </div>
);

export default PlayerWaiting;
