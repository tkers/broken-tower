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

const STACK_SIZE = 20;

function Lookup() {
  const { camera } = useThree();

  let [angle, setAngle] = useState(0);

  useFrame(() => {
    let distance = 80;

    camera.position.x = distance * Math.cos(angle);
    camera.position.y = 2 * STACK_SIZE;
    camera.position.z = distance * Math.sin(angle);

    camera.lookAt(0, 0, 0);
    setAngle(angle + 0.005);
  });

  return null;
}

function Score({ score }) {
  return (
    <div className="container">
      <p>Last piece</p>
      <span className="score">{score}</span>
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

function Tower({ pieces }) {
  return (
    <>
      {pieces.length > 0 && <Score score={pieces[pieces.length - 1]} />}

      <Canvas style={{ height: 800, width: 800 }}>
        <Lookup />
        <ambientLight />
        <pointLight position={[10, STACK_SIZE * 2, 10]} />

        {pieces.map((width, i, array) => (
          <Piece
            key={width}
            position={[0, i, 0]}
            width={width}
            color={i == array.length - 1 ? "red" : "orange"}
          />
        ))}
      </Canvas>
    </>
  );
}

export default Tower;