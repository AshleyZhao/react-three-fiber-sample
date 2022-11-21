import React, { useMemo, useRef } from 'react'
import ReactDOM from 'react-dom'

import { createRoot } from 'react-dom/client'
import { Canvas,useFrame,useLoader } from '@react-three/fiber'
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import moon1 from './images/moon_surface.jpg'
import moonD from './images/moon_displacement.jpg'
import { Physics, usePlane, useBox, useSphere } from "@react-three/cannon";
import "./styles.css";
import { useTexture } from "@react-three/drei"

// This code only reads CSV files
window.onload = () => {
	// (A) FILE PICKER
	let picker = document.getElementById("demoA");
   
	// (B) READ CSV FILE
	picker.onchange = () => {
	  // (B1) GET SELECTED CSV FILE
	  let selected = picker.files[0];
   
	  // (B2) READ CSV INTO ARRAY
	  let reader = new FileReader();
	  reader.addEventListener("loadend", () => {
		// (B2-1) SPLIT ROWS & COLUMNS
		let temp = reader.result.split("\r\n");
		for (let i in temp) {
		  temp[i] = temp[i].split(",");
		}
   
		// (B2-2) REARRANGE KEYS & VALUES
		let data = {};
		for (let i in temp[0]) {
		  data[temp[0][i]] = [];
		  for (let j=1; j<temp.length; j++) {
			data[temp[0][i]].push(temp[j][i]);
		  }
		}
   
		// (B2-3) DONE!
		// data = JSON.stringify(data);
		// picker.value = "";
		console.log(data);
	  });
	  reader.readAsText(selected);
	};
  };


function Box() {
	const [ref, api] = useBox(() => ({ mass: 1, position: [0, 2, 0] }));
	return (
		<mesh
			onClick={() => {
				api.velocity.set(0, 2, 0);
			}}
			ref={ref}
			position={[0, 2, 0]}
		>
			<boxBufferGeometry attach="geometry" />
			<meshLambertMaterial attach="material" color="hotpink" />
		</mesh>
	);
}

function Plane() {
	const [ref] = usePlane(() => ({
		rotation: [-Math.PI / 2, 0, 0],
	}));
	return (
		<mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
			<planeBufferGeometry attach="geometry" args={[100, 100]} opacity={0}/>
			<meshPhongMaterial color="#ffffff" opacity={0.0} transparent />
		</mesh>
	);
}

function Sphere() {
	/* Basic sphere */
	const base=new THREE.TextureLoader().load(moon1)
	/* Displacement map */
	const displacementMap = new THREE.TextureLoader().load(moonD)

	const sphereref = useRef();

	useFrame(() => {
		sphereref.current.rotation.y += 0.01;
	  });

	return (
		<mesh
			ref={sphereref}
			position={[0, 2, 0]}

			rotation-x={Math.PI} 
			rotation-y={Math.PI}
		>
			<sphereGeometry attach="geometry" args={[2, 32, 32]} />
			<directionalLight intensity={0.5} />
			<meshStandardMaterial displacementScale={0.2} map={base} displacementMap={displacementMap} color="white" depthWrite={true} metalness={0.4} roughness={0.7}/>
		</mesh>
	);
}

/* const Torus = (props) => {

	const dummy = new Object3D();
	extend({ OrbitControls });

	const torusRef = useRef();

	useFrame(({ clock }) => {
		const time = clock.getElapsedTime();
		meshRef.current.rotation.x = Math.sin(time / 4);
		meshRef.current.rotation.y = Math.sin(time / 2);
		let i = 0;
		const amount = 10;
		const offset = (amount - 1) / 2;
	
		for (let x = 0; x < amount; x++) {
		  for (let y = 0; y < amount; y++) {
			for (let z = 0; z < amount; z++) {
			  dummy.position.set(offset - x, offset - y, offset - z);
			  dummy.rotation.y =
				Math.sin(x / 2 + time) +
				Math.sin(y / 3 + time) +
				Math.sin(z / 4 + time);
			  dummy.rotation.z = dummy.rotation.y * 2;
	
			  dummy.updateMatrix();
	
			  meshRef.current.setMatrixAt(i++, dummy.matrix);
			}
			meshRef.current.instanceMatrix.needsUpdate = true;
		  }
		}
	  });
  
	return (
	  <mesh ref={torusRef}>
		<torusGeometry args={[1, 0.5, 38, 24]} />
		<meshBasicMaterial attach="material" args={[100, .5 , 50 ,50]} color="white"/>
	  </mesh>
	);
  };
 */

function Dot(props) {

	const ref = useRef();

	const { vec, transform, positions, distances } = useMemo(() => {
		const vec = new THREE.Vector2()
		const transform = new THREE.Matrix4()
	
		// Precompute randomized initial positions
		const positions = [...Array(10000)].map((_, i) => {
		  const position = new THREE.Vector3()
		  // Place in a grid
		  position.x = (i % 100) - 50
		  position.y = Math.floor(i / 100) - 50
	
		  // Offset every other column (hexagonal pattern)
		  position.y += (i % 2) * 0.5
		  return position
		})
	
		// Precompute initial distances with octagonal offset
		const right = new THREE.Vector3(1, 0, 0)
		const distances = positions.map((pos) => {
		  return pos.length() + Math.cos(pos.angleTo(right) * 8) * 0.5
		})
		return { vec, transform, positions, distances }
	  }, [])

	  useFrame(({ }) => {
		for (let i = 0; i < 10000; ++i) {

		  /* // Scale initial position by our oscillator
		  vec.copy(positions[i]).multiplyScalar(0 + 1.3)
	
		  // Apply the Vector3 to a Matrix4
		  transform.setPosition(vec)
	
		  // Update Matrix4 for this instance
		  ref.current.setMatrixAt(i, transform) */

		  ref.current.setMatrixAt(i, transform)
		
		}
		ref.current.instanceMatrix.needsUpdate = true
	  })

	return (
	  <instancedMesh ref={ref} args={[null, null, 10000]}>
		<circleBufferGeometry attach="geometry" args={[0.05, 100]} />      
		<meshNormalMaterial attach="material" color="white"/>
	  </instancedMesh>
	);
  }

createRoot(document.getElementById('root')).render(
	
	<Canvas>
		<OrbitControls />
		<pointLight color="#faf3ea" position={[0,200,200]} intensity={0.5} />
		<Stars />
		{/* <spotLight position={[10, 15, 10]} angle={0.3} /> */}
		<Physics>
			<Dot />
			<Sphere />
			<Plane />
			

		</Physics>
		
		
		
	</Canvas>
);