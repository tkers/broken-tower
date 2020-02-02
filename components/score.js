import React from "react";
import { getScore } from "./rating";

const Score = ({ pieces, remainingPieces }) => (
  <div className="container">
    <table className="score">
      <thead>
        <tr>
          <th>{pieces.length > 0 ? pieces[pieces.length - 1].size : "-"}</th>
          <th>{getScore(pieces, remainingPieces)}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Last Piece</td>
          <td>Points</td>
        </tr>
      </tbody>
    </table>
    <style jsx>{`
      .container {
        position: absolute;
        bottom: 0;
        width: 100%;
        right: 0;
        padding: 10px 4px;
        background-color: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(2px);
      }
      .score {
        padding: 0;
        width: 100%;
        border-collapse: collapse;
        font-size: 16px;
        color: #000000;
        text-align: center;
        margin: 0 auto;
      }
      .container td,
      .container th {
        border: 0;
        padding: 0;
      }
      .container th {
        font-size: 22px;
      }
    `}</style>
  </div>
);

export default Score;
