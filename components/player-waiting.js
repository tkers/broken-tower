import React from "react";
import QRCode from "qrcode.react";

const PlayerWaiting = ({ matchId, playerCount }) => (
  <div className="wrapper">
    <QRCode
      value={window.location.href}
      size={265}
      bgColor="#ffe89e"
      fgColor="#000000"
      includeMargin={true}
    />
    <div>
      {playerCount < 2 ? (
        "Waiting for other players to join..."
      ) : (
        <p>
          You and <strong>{playerCount - 1}</strong> other{" "}
          {playerCount - 1 === 1 ? "player" : "players"} waiting to start...
        </p>
      )}
    </div>
    <style jsx>
      {`
        .wrapper {
          max-width: 600px;
          margin: 50px auto 0;
          padding: 10px;
        }
      `}
    </style>
  </div>
);

export default PlayerWaiting;
