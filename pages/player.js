import React from "react";
import Head from "next/head";
import Nav from "../components/nav";
import io from "socket.io-client";

const Player = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <div>
      player board
    </div>
  </div>
);

class PlayerPage extends React.Component {
  // connect to WS server and listen event
  componentDidMount() {
    this.socket = io();
    this.socket.on("message", this.handleMessage);
    this.socket.on("connect", () => {
        this.socket.emit("send-piece", { piece: "piece" })
    })
  }

  // close socket connection
  componentWillUnmount() {
    this.socket.off("message", this.handleMessage);
    this.socket.close();
  }

  // add messages from server to the state
  handleMessage = message => {
    console.log("message:", message);
  };

  render() {
    return <Player />;
  }
}

export default PlayerPage;
