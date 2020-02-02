import React from "react";
import QRCode from "qrcode.react";

const TowerWaiting = ({
  matchId,
  playerCount,
  onStart,
  url,
  port,
  countdown
}) => {
  const fullurl = `${url}:${port}/player?matchId=${matchId}`;
  return (
    <div>
      <div className="hero">
        <h1 className="title">
          <a href={fullurl}>{matchId}</a>
        </h1>
        <p className="description">
          <QRCode
            value={fullurl}
            size={512}
            bgColor="#ffe89e"
            fgColor="#000000"
            includeMargin={true}
          />
          <br />
          {countdown && (
            <span className="title">Starting in {countdown}...</span>
          )}
        </p>

        <div className="row">
          <a
            href="#"
            onClick={playerCount >= 2 ? onStart : undefined}
            className="card"
          >
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
        .title a {
          color: #005599;
          text-decoration: none;
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
          border-color: #228877;
        }
        .card h3 {
          margin: 0;
          color: #228877;
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
