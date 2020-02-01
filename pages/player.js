import React from "react";
import io from "socket.io-client";
import PlayerWaiting from "../components/player-waiting";
import PlayerStarted from "../components/player-started";

class PlayerPage extends React.Component {
    // connect to WS server and listen event

    state = {gameId: null, started: false, playerCount: 0, pieces: []};

    componentDidMount() {
        this.socket = io();
        this.socket.on("message", this.handleMessage);
        this.socket.on("connect", () => {
            const urlParams = new URLSearchParams(window.location.search);
            const gameId = urlParams.get("gameId");
            this.socket.emit("join-game", {gameId}, data => {
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
                this.setState({playerCount: this.state.playerCount + 1});
            });
            this.socket.on("player-leave", () => {
                this.setState({playerCount: this.state.playerCount - 1});
            });

            this.socket.on("start", data => {
                console.log("START GAME!");
                this.setState({started: true, pieces: data.pieces});
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
        return this.state.started ? (
            <PlayerStarted
                gameId={this.state.gameId}
                pieces={this.state.pieces}
                socket={this.socket}
            />
        ) : (
            <PlayerWaiting
                gameId={this.state.gameId}
                playerCount={this.state.playerCount}
                socket={this.socket}
            />)
    }
}

export default PlayerPage;
