import React, { useRef } from 'react'
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

const myHTML = `<h1>John Doe</h1>`;

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

createRoot(document.getElementById('root')).render(
	
	<Canvas>
		<OrbitControls />
		<pointLight color="#faf3ea" position={[0,200,200]} intensity={0.5} />
		<Stars />
		{/* <spotLight position={[10, 15, 10]} angle={0.3} /> */}
		<Physics>
		
			<Sphere />
			<Plane />

		</Physics>
	</Canvas>
);