import React from "react";

import { countWrongPieces } from "./rating";
import Tower from "./tower";

function Score({ pieces }) {
  const last = pieces.length > 0 ? pieces[pieces.length - 1] : undefined;
  const wrong = countWrongPieces(pieces);
  return (
    <div className="container">
      <table className="score">
        <tr>
          <th>Last Piece</th>
          <th>Wrong Pieces</th>
        </tr>
        <tr>
          <td>{last}</td>
          <td>{wrong}</td>
        </tr>
      </table>
      <style jsx>{`
        .container {
          position: absolute;
          bottom: 0;
          width: 100vw;
          right: 0;
        }
        .score {
          border-collapse: collapse;
          font-size: 24px;
          margin-top: 50px;
          color: darkOrange;
          text-align: center;
          margin: 0 auto;
        }
        .container td,
        .container th {
          border: 1px solid #ddd;
          padding: 8px;
        }
      `}</style>
    </div>
  );
}

const TowerStarted = ({ remainingPieces, pieces }) => {
  return (
    <div>
      <div className="hero">
        <p className="description">{remainingPieces} pieces remaining</p>
      </div>

      <Tower pieces={pieces} />

      {pieces.length > 0 && <Score pieces={pieces} />}

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

export default TowerStarted;
