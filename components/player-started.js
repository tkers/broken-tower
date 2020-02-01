import React from "react";
import Head from "next/head";
import Nav from "./nav";
import { Swipeable } from "react-swipeable";

const PlayerStarted = ({ matchId, pieces, sendPiece }) => {
  return (
    <Swipeable onSwipedUp={sendPiece}>
      <div className={"player-board"}>
        <Head>
          <title>Player</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav />

        <div>
          Game started
          <br />
          Match ID: {matchId}
          <br />
          Pieces: {pieces.join(", ")}
          <br />
          <button onClick={sendPiece}>Send Piece</button>
        </div>
      </div>
      <style jsx>{`
        .player-board {
          background-color: lightblue;
          height: 100vh;
        }
      `}</style>
    </Swipeable>
  );
};

export default PlayerStarted;
