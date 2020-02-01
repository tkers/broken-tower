import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const useSocket = () => {
  const socket = useRef();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const sock = io();

    sock.on("connect", () => {
      setConnected(true);
    });

    sock.on("disconnect", () => {
      setConnected(false);
    });

    socket.current = sock;

    return () => {
      socket.current && socket.current.close();
    };
  }, []);

  return { socket, connected };
};

export default useSocket;
