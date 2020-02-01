import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";

function Piece(props) {
  return (
    <mesh position={props.position} scale={[props.width, 1, props.width]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={props.color} />
    </mesh>
  );
}

function Lookup({ stackSize }) {
  const { camera } = useThree();

  let [angle, setAngle] = useState(0);

  useFrame(() => {
    let distance = 120;

    camera.position.x = distance * Math.cos(angle);
    camera.position.y = 1.5 * stackSize + 20;
    camera.position.z = distance * Math.sin(angle);

    camera.lookAt(0, stackSize, 0);
    setAngle(angle + 0.005);
  });

  return (
    <pointLight
      position={[camera.position.x, camera.position.y, camera.position.z]}
      intensity={0.3}
    />
  );
}

function Score({ last, wrong }) {
  return (
    <div className="container">
      <p>Last piece</p>
      <span className="score">{last}</span>
      <p>wrong pieces</p>
      <span className="score">{wrong}</span>
      <style jsx>{`
        .container {
          margin-top: 50px;
          color: darkOrange;

          text-align: center;
          width: 100px;
          margin: 0 auto;
        }
        .score {
          font-size: 40px;
        }
      `}</style>
    </div>
  );
}

const getWrongPieces = arr => {
  let n = 0;
  arr.forEach((width, i, array) => {
    const bad = i !== 0 && array[i] > array[i - 1];
    if (bad) n++;
  });
  return n;
};

function Tower({ pieces, myPieces = [] }) {
  return (
    <>
      {pieces.length > 0 && (
        <Score
          last={pieces[pieces.length - 1]}
          wrong={getWrongPieces(pieces)}
        />
      )}

      <Canvas style={{ height: 500 }}>
        <Lookup stackSize={pieces.length + myPieces.length + 20} />
        <ambientLight />
        <pointLight
          position={[20, (pieces.length + myPieces.length) / 2, 30]}
          intensity={0.8}
        />

        <group scale={[1, 2.5, 1]}>
          {myPieces.map((width, i, array) => (
            <Piece
              key={width}
              position={[0, pieces.length + 20 + i, 0]}
              width={width}
              color={i == 0 ? "#228877" : "#005599"}
            />
          ))}

          {pieces.map((width, i, array) => {
            const bad = i !== 0 && array[i] > array[i - 1];
            return (
              <Piece
                key={width}
                position={[0, i, 0]}
                width={width}
                color={
                  bad
                    ? "#dd2244"
                    : i == array.length - 1
                    ? "#ddaa00"
                    : "#ab9a63"
                }
              />
            );
          })}

          <Piece position={[0, -1, 0]} width={101} color={"#ab9a63"} />
        </group>
      </Canvas>
    </>
  );
}

export default Tower;
