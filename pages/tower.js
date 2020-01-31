const range = i => new Array(i + 1).fill(0).map((_, i) => i);

const getPieces = n => range(n - 1).map(i => i + 1);

const Stack = ({ pieces }) => {
  return (
    <div>
      {pieces.map(width => (
        <div
          style={{
            margin: "0 auto",
            textAlign: "center",
            background: "lightBlue",
            border: "1px solid black",
            lineHeight: "25px",
            height: "25px",
            width: `${width * 10}px`
          }}
        >
          {width}
        </div>
      ))}
    </div>
  );
};

function Tower () {
  return <Stack pieces={getPieces(60) }/>
}

export default Tower;
