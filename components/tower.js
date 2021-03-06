import React, { useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import Text from "./text";

function Piece(props) {
  return (
    <mesh position={props.position} scale={[props.width, 1, props.width]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={props.color} />
    </mesh>
  );
}

function LastSize({ pieces, position, rotation }) {
  const str =
    pieces.length > 0 ? pieces[pieces.length - 1].size.toString() : "";

  return (
    <Suspense fallback={null}>
      <Text
        hAlign="center"
        position={position}
        rotation={rotation}
        children={str}
        size={8}
        color="#26323d"
      />
    </Suspense>
  );
}

function Lookup({ stackSize, pieces, showLastSize }) {
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
    <>
      <pointLight
        position={[camera.position.x, camera.position.y, camera.position.z]}
        intensity={0.3}
      />
      {showLastSize ? (
        <LastSize
          pieces={pieces}
          position={[0, pieces.length * 2.5 + 25, 0]}
          rotation={[0, 1.6 - angle, 0]}
        />
      ) : null}
    </>
  );
}

function Tower({ pieces, myPieces = [], height = 500, showLastSize }) {
  return (
    <>
      <Canvas style={{ height }}>
        <Lookup
          stackSize={pieces.length + myPieces.length + 20}
          pieces={pieces}
          showLastSize={showLastSize}
        />
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
              color={i === 0 ? "#228877" : "#005599"}
            />
          ))}

          {pieces.map((piece, i, array) => (
            <Piece
              key={piece.size}
              position={[0, i, 0]}
              width={piece.size}
              color={
                !piece.stable
                  ? "#dd2244"
                  : i === array.length - 1
                  ? "#ddaa00"
                  : "#ab9a63"
              }
            />
          ))}
          <Piece position={[0, -1, 0]} width={101} color={"#ab9a63"} />
        </group>
      </Canvas>
    </>
  );
}

export default Tower;
