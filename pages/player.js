import React from "react";
import Head from "next/head";
import Nav from "../components/nav";
import io from "socket.io-client";

const Player = ({ gameId, playerCount, started, pieces }) => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <div>
      player board
      <br />
      Game ID: {gameId}
      <br />
      Player Count:{playerCount}
      <br />
      {started ? "Started!" : "Waiting for other players..."}
      <br />
      Pieces: {pieces.join(", ")}
    </div>
  </div>
);

class PlayerPage extends React.Component {
  // connect to WS server and listen event

  state = { gameId: null, started: false, playerCount: 0, pieces: [] };

  componentDidMount() {
    this.socket = io();
    this.socket.on("message", this.handleMessage);
    this.socket.on("connect", () => {
      // this.socket.emit("send-piece", { piece: "piece" });

      const urlParams = new URLSearchParams(window.location.search);
      const gameId = urlParams.get("gameId");
      this.socket.emit("join-game", { gameId }, data => {
        if (data.error) {
          alert("Error: " + data.error);
          return;
        }

        this.setState({
          gameId,
          playerCount: data.playerCount,
          started: false
        });
      });

      this.socket.on("player-join", () => {
        this.setState({ playerCount: this.state.playerCount + 1 });
      });

      this.socket.on("start", data => {
        console.log("START GAME!");
        this.setState({ started: true, pieces: data.pieces });
      });
    });
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
    return (
      <Player
        gameId={this.state.gameId}
        playerCount={this.state.playerCount}
        started={this.state.started}
        pieces={this.state.pieces}
      />
    );
  }
}

export default PlayerPage;
