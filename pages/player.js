import React from "react";
import io from "socket.io-client";

import PlayerWaiting from "../components/player-waiting";
import PlayerStarted from "../components/player-started";
import PlayerDisconnected from "../components/player-disconnected";

class PlayerPage extends React.Component {
  // connect to WS server and listen event

  socket = null;
  state = {
    connected: false,
    gameId: null,
    started: false,
    playerCount: 0,
    pieces: []
  };

  componentDidMount() {
    this.socket = io();

    this.socket.on("connect", () => {
      this.setState({ connected: true });
      this.joinGame();
    });

    this.socket.on("disconnect", () => {
      this.setState({ connected: false });
    });

    this.socket.on("player-join", () => {
      this.setState({ playerCount: this.state.playerCount + 1 });
    });

    this.socket.on("player-leave", () => {
      this.setState({ playerCount: this.state.playerCount - 1 });
    });

    this.socket.on("start", data => {
      console.log("START GAME!");
      this.setState({ started: true, pieces: data.pieces });
    });
  }

  // close socket connection
  componentWillUnmount() {
    this.socket.close();
  }

  sendPiece = (e, deltaY, isFlick) => {
    const { pieces } = this.state;
    if (pieces.length) {
      const biggerPiece = Math.max(...pieces);
      this.socket.emit("send-piece", biggerPiece);
      this.setState({ pieces: pieces.filter(p => p !== biggerPiece) });
    }
  };

  joinGame() {
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
  }

  render() {
    return this.state.connected ? (
      this.state.started ? (
        <PlayerStarted
          gameId={this.state.gameId}
          pieces={this.state.pieces}
          sendPiece={this.sendPiece}
          socket={this.socket}
        />
      ) : (
        <PlayerWaiting
          gameId={this.state.gameId}
          playerCount={this.state.playerCount}
          socket={this.socket}
        />
      )
    ) : (
      <PlayerDisconnected />
    );
  }
}

export default PlayerPage;
