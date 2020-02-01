import React from "react";

import Tower from "./tower";
import { getScore } from "./rating";

const PlayerFinished = ({ pieces }) => {
  return (
    <>
      <div className="wrapper">
        <div className="hero">
          <p className="description">Final Score: {getScore(pieces)}</p>
        </div>
        <Tower pieces={pieces} />
      </div>
      <style jsx>{`
        .wrapper {
          max-width: 600px;
          margin: 50px auto 0;
          padding: 50px;
          text-align: center;
        }
        .hero {
          width: 100%;
          color: #333;
        }

        .description {
          text-align: center;
        }
      `}</style>
    </>
  );
};

export default PlayerFinished;
