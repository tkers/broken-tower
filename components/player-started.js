import React from "react";

import Score from "./score";
import Tower from "./tower";
import { Swipeable } from "react-swipeable";

const PlayerStarted = ({ pieces, myPieces, sendPiece }) => {
  return (
    <Swipeable onSwipedUp={() => {}}>
      <div className="wrapper">
        <div>
          <div>My Pieces:</div> <b>{myPieces[0] || ""}</b>
          {myPieces.length > 1 ? ", " : ""}
          {myPieces.slice(1).join(", ")}
          <br />
          {myPieces.length > 0 ? (
            <button onClick={sendPiece} className="bigButton">
              Send Piece
            </button>
          ) : null}
        </div>
        <Tower pieces={pieces} myPieces={myPieces} />
        <Score pieces={pieces} />
      </div>
      <style jsx>{`
        .wrapper {
          font-size: 18px;
          max-width: 600px;
          margin: 20px auto 0;
          padding: 0 10px;
          text-align: center;
        }
        .bigButton {
          background-color: #00aa44;
          color: whitesmoke;
          box-shadow: 0px 0px 3px #00000052;
          border-radius: 3px;
          padding: 16px 32px;
          display: block;
          margin: 15px auto;
          border: none;
          font-size: 24px;
        }
      `}</style>
    </Swipeable>
  );
};

export default PlayerStarted;
