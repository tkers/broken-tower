import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";

const range = i => new Array(i + 1).fill(0).map((_, i) => i);

const getPieces = n =>
  range(n - 1)
    .map(i => i + 1)
    .reverse();

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

function Tower() {
  let [pieces, setPieces] = useState([20]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      let last = pieces[pieces.length - 1];
      if (last > 1) {
        setPieces([...pieces, last - 1]);
      } else {
        setPieces([20]);
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
