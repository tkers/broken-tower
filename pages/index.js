import React from "react";
import io from "socket.io-client";
import TowerWaiting from "../components/tower-waiting";
import TowerStarted from "../components/tower-started";

class Home extends React.Component {
  // connect to WS server and listen event
  state = { connected: false, started: false, gameId: null };

  componentDidMount() {
    this.socket = io();

    this.socket.on("connect", () => {
      this.setState({ connected: true });
      this.socket.emit("new-game", data => {
        const gameId = data.gameId;
        this.setState({ gameId, playerCount: 0, ip: data.ip, port: data.port });
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
    this.socket.emit("start-game", data => {
      if (data.error) {
        alert(data.error);
      } else {
        console.log("Game started!", data);
        this.setState({ started: true });
      }
    });
  };

  render() {
    return this.state.connected ? (
      this.state.started ? (
        <TowerStarted
          gameId={this.state.gameId}
          playerCount={this.state.playerCount}
          socket={this.socket}
        />
      ) : (
        <TowerWaiting
          gameId={this.state.gameId}
          ip={this.state.ip}
          port={this.state.port}
          playerCount={this.state.playerCount}
          onStart={this.startGame}
          countdown={this.state.countdown}
          socket={this.socket}
        />
      )
    ) : (
      <div>
        Disconnected :(
        <br />
        <a href="/">Refresh</a>
      </div>
    );
  }
}

export default Home;
