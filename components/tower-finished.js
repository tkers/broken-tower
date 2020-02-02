import React from "react";

import Tower from "./tower";
import Score from "./score";
import Stars from "./stars";
import { getScore } from "./rating";

const TowerFinished = ({ pieces, restartMatch }) => {
  return (
    <div>
      <div className="hero">
        <p className="description">
          Game Over
          <Stars score={getScore(pieces)} />
        </p>
        <button className="bigButton" onClick={restartMatch}>
          Play again?
        </button>
      </div>

      <Tower pieces={pieces} />

      <Score pieces={pieces} />

      <style jsx>{`
        .hero {
          width: 100%;
          color: #333;
        }

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
    </div>
  );
};

export default TowerFinished;
