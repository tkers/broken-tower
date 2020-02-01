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
    matchId: null,
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

    this.socket.on("deal-pieces", data => {
      this.setState({ pieces: data.pieces });
    });

    this.socket.on("start", () => {
      this.setState({ started: true });
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
    const matchId = urlParams.get("matchId");

    this.socket.emit("connect-match", { matchId }, data => {
      if (data.error) {
        alert("Error: " + data.error);
        return;
      }

      this.setState({
        matchId,
        playerCount: data.playerCount,
        started: false
      });

      this.socket.emit("join-match", res => {
        if (res.error) {
          alert(res.error);
          return;
        }
      });
    });
  }

  render() {
    return this.state.connected ? (
      this.state.started ? (
        <PlayerStarted
          matchId={this.state.matchId}
          pieces={this.state.pieces}
          sendPiece={this.sendPiece}
          socket={this.socket}
        />
      ) : (
        <PlayerWaiting
          matchId={this.state.matchId}
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
