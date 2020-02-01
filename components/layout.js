import React from "react";
import Head from "next/head";

const Layout = ({ children }) => (
  <>
    <Head>
      <title>Broken Tower</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    {children}
    <style jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
        font-size: 32px;
        color: #ff5722;
      }
      a {
        color: #067df7;
        text-decoration: none;
        font-size: 13px;
      }
    `}</style>
  </>
);

export default Layout;
