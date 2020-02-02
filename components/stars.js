import React from "react";

const Stars = ({ score, max = 5 }) => {
  const n = Math.round((score * max) / 1000);
  const fill = "⭐️ ".repeat(n);
  const back = "⭐️ ".repeat(max - n);
  return (
    <>
      <span>{fill}</span>
      <span style={{ opacity: 0.5, filter: "grayscale(100%)" }}>{back}</span>
    </>
  );
};

export default Stars;
