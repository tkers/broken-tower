import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";

const range = i => new Array(i + 1).fill(0).map((_, i) => i);

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function getStack(n) {
  return shuffle(range(n * 2))
    .slice(0, Math.floor(n))
    .sort((x, y) => y - x);
}

function Piece(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  return (
    <mesh {...props} ref={mesh} scale={[props.width, 1, props.width]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={"orange"} />
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

let stack = getStack(20);

function Tower() {
  let [pieces, setPieces] = useState([]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (pieces.length < stack.length) {
        setPieces(stack.slice(0, pieces.length + 1));
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [pieces]);

  return (
    <Canvas style={{ height: 800, width: 800 }}>
      <Lookup />
      <ambientLight />
      <pointLight position={[10, STACK_SIZE, 10]} />
      {pieces.map((width, i) => (
        <Piece key={width} position={[0, i, 0]} width={width} />
      ))}
    </Canvas>
  );
}

export default Tower;
