import React from "react";

import Tower from "./tower";
import Score from "./score";
import Stars from "./stars";
import { getScore } from "./rating";

const PlayerFinished = ({ pieces }) => {
  return (
    <>
      <div className="wrapper">
        <div className="hero">
          <p className="description">
            Game Over
            <Stars score={getScore(pieces)} />
          </p>
        </div>
        <Tower pieces={pieces} />
        <Score pieces={pieces} />
      </div>
      <style jsx>{`
        .wrapper {
          max-width: 600px;
          margin: 20px auto 0;
          padding: 0 10px;
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
