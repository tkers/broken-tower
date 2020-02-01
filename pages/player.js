import React from "react";
import io from "socket.io-client";
import {Swipeable} from 'react-swipeable'

import PlayerWaiting from "../components/player-waiting";
import PlayerStarted from "../components/player-started";

class PlayerPage extends React.Component {
    // connect to WS server and listen event

    state = {gameId: null, started: false, playerCount: 0, pieces: []};

    swiping(e, deltaX, deltaY, absX, absY, velocity) {
        console.log("You're Swiping...", e, deltaX, deltaY, absX, absY, velocity)
    }

    swipingLeft(e, absX) {
        console.log("You're Swiping to the Left...", e, absX)
    }

    swiped(e, deltaX, deltaY, isFlick, velocity) {
        console.log("You Swiped...", e, deltaX, deltaY, isFlick, velocity)
    }

    swipedUp = (e, deltaY, isFlick) => {
        const { pieces } = this.state
        console.log("You Swiped Up...", e, deltaY, isFlick)
        if (pieces.length) {
            const biggerPiece = Math.max(...pieces)
            this.socket.emit("send-piece", biggerPiece)
            this.setState({pieces: pieces.filter(p => p !== biggerPiece)})
        }
    }

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
        return (
                <Swipeable
                    onSwiping={this.swiping}
                    onSwipingLeft={this.swipingLeft}
                    onSwiped={this.swiped}
                    onSwipedUp={this.swipedUp}>
                    <div className={'player-board'}>

                    {this.state.started ? (
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
                    </div>
                    <style jsx>{`
                      .player-board {
                        background-color: lightblue;
                        height: 100vh;
                      }
                    `}</style>
                </Swipeable>
        )
    }
}

export default PlayerPage;
