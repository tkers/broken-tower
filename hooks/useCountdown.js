import React, { useState, useEffect, useRef } from "react";
import useInterval from "./useInterval";

function useCountdown(cb, delay = 1000) {
  const [ticking, setTicking] = useState(false);
  const [time, setTime] = useState(0);

  const start = n => {
    setTime(n);
    setTicking(true);
  };

  const stop = () => {
    setTicking(false);
    setTime(undefined);
  };

  useInterval(() => {
    if (!ticking) {
      return;
    }

    if (time > 1) {
      setTime(time - 1);
    } else {
      stop();
      cb();
    }
  }, delay);

  return { start, stop, time };
}

export default useCountdown;
