import React from "react";

import Tower from "./tower";
import { getScore } from "./rating";

const TowerFinished = ({ pieces }) => {
  return (
    <div>
      <div className="hero">
        <p className="description">Final Score: {getScore(pieces)}</p>
      </div>

      <Tower pieces={pieces} />

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
      `}</style>
    </div>
  );
};

export default TowerFinished;
