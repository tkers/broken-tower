import React from "react";
import io from "socket.io-client";

import TowerWaiting from "../components/tower-waiting";
import TowerStarted from "../components/tower-started";
import TowerDisconnected from "../components/tower-disconnected";

class Home extends React.Component {
  // connect to WS server and listen event
  state = { connected: false, started: false, matchId: null, pieces: [] };

  componentDidMount() {
    this.socket = io();

    this.socket.on("connect", () => {
      this.setState({ connected: true });
      this.socket.emit("create-match", data => {
        console.log("createmathc reply:", data);
        const matchId = data.matchId;
        this.setState({
          matchId,
          playerCount: 0,
          ip: data.ip,
          port: data.port
        });
      });
    });

    this.socket.on("disconnect", () => {
      this.setState({ connected: false });
    });

    this.socket.on("player-join", () => {
      this.setState({ playerCount: this.state.playerCount + 1 }, () => {
        if (this.state.playerCount >= 2) {
          this.restartCountdown();
        }
      });
    });

    this.socket.on("player-leave", () => {
      this.setState({ playerCount: this.state.playerCount - 1 }, () => {
        if (this.state.playerCount < 2) {
          this.cancelCountdown();
        }
      });
    });

    this.socket.on("send-piece", data => {
      this.receivePiece(data);
    });
  }

  // close socket connection
  componentWillUnmount() {
    this.socket.off("message", this.handleMessage);
    this.socket.close();
  }

  restartCountdown() {
    clearInterval(this.countInterval);
    this.setState({ countdown: 30 });
    this.countInterval = setInterval(this.tick, 1000);
  }

  cancelCountdown() {
    clearInterval(this.countInterval);
    this.setState({ countdown: null });
  }

  tick = () => {
    if (this.state.countdown === 0) {
      this.cancelCountdown();
      this.startGame();
    } else {
      this.setState({ countdown: this.state.countdown - 1 });
    }
  };

  startGame = () => {
    this.socket.emit("start-match", data => {
      if (data.error) {
        alert(data.error);
      } else {
        console.log("Game started!", data);
        this.setState({ started: true });
      }
    });
  };

  receivePiece = piece => {
    console.log("received", piece);
    this.setState(state => {
      console.log({ state });
      return {
        pieces: [...state.pieces, piece]
      };
    });
  };

  render() {
    console.log(this.state);
    return this.state.connected ? (
      this.state.started ? (
        <TowerStarted
          matchId={this.state.matchId}
          playerCount={this.state.playerCount}
          socket={this.socket}
          pieces={this.state.pieces}
        />
      ) : (
        <TowerWaiting
          matchId={this.state.matchId}
          ip={this.state.ip}
          port={this.state.port}
          playerCount={this.state.playerCount}
          onStart={this.startGame}
          countdown={this.state.countdown}
          socket={this.socket}
        />
      )
    ) : (
      <TowerDisconnected />
    );
  }
}

export default Home;
