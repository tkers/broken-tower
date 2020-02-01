import React from "react";
import {countWrongPieces} from "./rating";

function Score({ pieces }) {
    const last = pieces.length > 0 ? pieces[pieces.length - 1] : undefined;
    const wrong = countWrongPieces(pieces);
    return (
        <div className="container">
            <table className="score">
                <thead>
                <tr>
                    <th>Last Piece</th>
                    <th>Wrong Pieces</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{last}</td>
                    <td>{wrong}</td>
                </tr>
                </tbody>
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

export default Score;
