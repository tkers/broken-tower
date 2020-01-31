import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";

const range = i => new Array(i + 1).fill(0).map((_, i) => i);

const getPieces = n => range(n - 1).map(i => i + 1);

function Piece(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  return (
    <mesh {...props} ref={mesh} scale={[props.width, 1, props.width]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color={hovered ? "hotpink" : "orange"}
      />
    </mesh>
  );
}

function Lookup() {
  const { camera } = useThree();

  let [angle, setAngle] = useState(0);

  useFrame(() => {
    camera.position.x = 50 * Math.cos(angle);
    camera.position.y = 0;
    camera.position.z = 50 * Math.sin(angle);

    camera.lookAt(0, 0, 0);
    setAngle(angle + 0.005);
  });

  return null;
}

function Tower() {
  return (
    <Canvas
      style={{ height: 800, width: 800 }}
      camera={{ position: [10, 0, 50] }}
    >
      <Lookup />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {getPieces(20).map(i => (
        <Piece key={i} position={[0, -i, 0]} width={i} />
      ))}
    </Canvas>
  );

  // return <Stack pieces={getPieces(60)} />;
}

export default Tower;
