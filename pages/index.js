import React from "react";
import io from "socket.io-client";
import TowerWaiting from "../components/tower-waiting";
import TowerStarted from "../components/tower-started";

class Home extends React.Component {
  // connect to WS server and listen event
  state = { started: false, gameId: null };
  componentDidMount() {
    this.socket = io();
    this.socket.on("message", this.handleMessage);
    this.socket.on("connect", () => {
      this.socket.emit("new-game", data => {
        const gameId = data.gameId;
        this.setState({ gameId, playerCount: 0, ip: data.ip, port: data.port });
      });
    });
    this.socket.on("player-join", () => {
      this.setState({ playerCount: this.state.playerCount + 1 });
    });
    this.socket.on("player-leave", () => {
      this.setState({ playerCount: this.state.playerCount - 1 });
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
    return this.state.started ? (
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
        socket={this.socket}
      />
    );
  }
}

export default Home;
