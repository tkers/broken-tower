import React from "react";
import Head from "next/head";
import Nav from "../components/nav";
import io from "socket.io-client";
import QRCode from "qrcode.react";

const DemoHome = ({ gameId, ip, port }) => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <div className="hero">
      <h1 className="title">{gameId}</h1>
      <p className="description">
        <QRCode
          value={`http://${ip}:${port}/player?gameId=${gameId}`}
          size={512}
          bgColor="#FFFF00"
          fgColor="#000000"
          includeMargin={true}
        />
      </p>

      <div className="row">
        <a href="https://nextjs.org/docs" className="card">
          <h3>Start Game!</h3>
          <p>woop</p>
        </a>
        <a href="https://nextjs.org/learn" className="card">
          <h3>Next.js Learn &rarr;</h3>
          <p>Learn about Next.js by following an interactive tutorial!</p>
        </a>
        <a
          href="https://github.com/zeit/next.js/tree/master/examples"
          className="card"
        >
          <h3>Examples &rarr;</h3>
          <p>Find other example boilerplates on the Next.js GitHub.</p>
        </a>
      </div>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
    `}</style>
  </div>
);

class Home extends React.Component {
  // connect to WS server and listen event
  state = {};
  componentDidMount() {
    this.socket = io();
    this.socket.on("message", this.handleMessage);
    this.socket.on("connect", () => {
      this.socket.emit("new-game", data => {
        const gameId = data.gameId;
        this.setState({ gameId, ip: data.ip, port: data.port });
      });

      const tryStart = () => {
        this.socket.emit("start-game", data => {
          if (data.error) {
            console.log(data.error, "retry in 5 sec...");
            // probably not enough players
            setTimeout(() => tryStart(), 5000);
          } else {
            console.log("Game started!", data);
          }
        });
      };
      tryStart();
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
      <DemoHome
        gameId={this.state.gameId}
        ip={this.state.ip}
        port={this.state.port}
      />
    );
  }
}

export default Home;
