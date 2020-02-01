import React from "react";
import Head from "next/head";
import Nav from "./nav";
import {Swipeable} from "react-swipeable";

const PlayerStarted = ({gameId, pieces, socket}) => {

    const swipedUp = (e, deltaY, isFlick) => {
        const {pieces} = this.state
        console.log("You Swiped Up...", e, deltaY, isFlick)
        if (pieces.length) {
            const biggerPiece = Math.max(...pieces)
            this.socket.emit("send-piece", biggerPiece)
            this.setState({pieces: pieces.filter(p => p !== biggerPiece)})
        }
    }

    return <Swipeable
        onSwipedUp={swipedUp}>
        <div className={'player-board'}><Head>
            <title>Player</title>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

            <Nav/>

            <div>
                Game started
                <br/>
                Game ID: {gameId}
                <br/>
                Pieces: {pieces.join(", ")}
            </div>
        </div>
        <style jsx>{`
                      .player-board {
                        background-color: lightblue;
                        height: 100vh;
                      }
                    `}</style>
    </Swipeable>
}

export default PlayerStarted;
