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
    camera.position.y = 4 * stackSize + 10;
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

function Tower({ pieces, myPieces = [] }) {
  return (
    <>
      {pieces.length > 0 && <Score score={pieces[pieces.length - 1]} />}

      <Canvas style={{ height: 500 }}>
        <Lookup stackSize={pieces.length + myPieces.length + 20} />
        <ambientLight />
        <pointLight
          position={[20, pieces.length + myPieces.length + 30, 30]}
          intensity={0.8}
        />

        <group scale={[1, 2.5, 1]}>
          {myPieces.map((width, i, array) => (
            <Piece
              key={width}
              position={[0, pieces.length + 20 + i, 0]}
              width={width}
              color={i == 0 ? "#00AA44" : "#005599"}
            />
          ))}

          {pieces.map((width, i, array) => (
            <Piece
              key={width}
              position={[0, i, 0]}
              width={width}
              color={i == array.length - 1 ? "#ee2233" : "orange"}
            />
          ))}

          <Piece position={[0, -1, 0]} width={101} color={"orange"} />
        </group>
      </Canvas>
    </>
  );
}

export default Tower;
