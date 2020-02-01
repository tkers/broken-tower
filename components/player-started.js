import React from "react";
import Head from "next/head";
import Nav from "./nav";

// socket.emit("send-piece", { piece: "piece" });

const PlayerStarted = ({ gameId, pieces, socket }) => (
  <div>
    <Head>
      <title>Player</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <div>
      Game started
      <br />
      Game ID: {gameId}
      <br />
      Pieces: {pieces.join(", ")}
    </div>
  </div>
);

export default PlayerStarted;
