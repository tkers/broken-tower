import React from "react";

import Tower from "./tower";
import { Swipeable } from "react-swipeable";

const PlayerStarted = ({ pieces, myPieces, sendPiece }) => {
  // myPieces = [40, 23, 12, 5];
  // pieces = [60, 50, 45];
  return (
    <Swipeable onSwipedUp={() => {}}>
      <div className="wrapper">
        <div>
          My Pieces: {myPieces.join(", ")}
          <br />
          <button onClick={sendPiece} className="bigButton">
            Send Piece
          </button>
        </div>
        <Tower pieces={pieces} myPieces={myPieces} />
      </div>
      <style jsx>{`
        .wrapper {
          max-width: 600px;
          margin: 50px auto 0;
          padding: 50px;
          text-align: center;
        }
        .bigButton {
          background-color: #00aa44;
          padding: 16px 32px;
          display: block;
          margin: 0 auto;
          border: none;
        }
      `}</style>
    </Swipeable>
  );
};

export default PlayerStarted;
