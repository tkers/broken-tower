import React from "react";
import QRCode from "qrcode.react";

const TowerWaiting = ({
  matchId,
  playerCount,
  onStart,
  ip,
  port,
  countdown
}) => {
  const url = `http://${ip}:${port}/player?matchId=${matchId}`;
  return (
    <div>
      <div className="hero">
        <h1 className="title">
          <a href={url}>{matchId}</a>
        </h1>
        <p className="description">
          <QRCode
            value={url}
            size={512}
            bgColor="#ffffff"
            fgColor="#ff5722"
            includeMargin={true}
          />
          {countdown && <h1 className="title">Starting in {countdown}...</h1>}
        </p>

        <div className="row">
          <a href="#" onClick={playerCount >= 2 && onStart} className="card">
            <h3>{playerCount >= 2 ? "Start Game!" : "Waiting for players"}</h3>
            <p>{playerCount} players connected</p>
          </a>
        </div>
      </div>

      <style jsx>{`
        .hero {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          width: 100%;
          padding-top: 80px;
          line-height: 1.15;
          font-size: 48px;
        }
        .title,
        .description {
          text-align: center;
        }
        .row {
          max-width: 880px;
          margin: 80px auto 40px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
        .card {
          padding: 18px 18px 24px;
          width: 220px;
          text-align: left;
          text-decoration: none;
          color: #434343;
          border: 1px solid #9b9b9b;
        }
        .card:hover {
          border-color: #067df7;
        }
        .card h3 {
          margin: 0;
          color: #067df7;
          font-size: 18px;
        }
        .card p {
          margin: 0;
          padding: 12px 0 0;
          font-size: 13px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default TowerWaiting;
