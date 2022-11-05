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
			<planeBufferGeometry attach="geometry" args={[100, 100]} />
			<meshLambertMaterial attach="material" />
		</mesh>
	);
}

function Sphere() {
	/* Basic sphere */
	const base=new THREE.TextureLoader().load(moon1)
	/* Displacement map */
	const displacementMap = new THREE.TextureLoader().load(moonD)

	const [ref, api] = useSphere(() => ({ mass: 1, position: [0, 2, 0] }));
	return (
		<mesh
			onClick={() => {
				api.velocity.set(0, 2, 0);
			}}
			ref={ref}
			position={[0, 2, 0]}
		>
			<sphereGeometry attach="geometry" args={[2, 32, 32]} />
			<directionalLight intensity={0.5} />
			<meshStandardMaterial displacementScale={0.3} map={base} displacementMap={displacementMap} color="white" />
		</mesh>
	);
}

createRoot(document.getElementById('root')).render(
	<Canvas>
		<OrbitControls />
		<Stars />
		<ambientLight intensity={0.5} />
		<spotLight position={[10, 15, 10]} angle={0.3} />
		<Physics>
			
			{/* <Box />
			<Plane /> */}
			<Sphere />
			<Plane />

		</Physics>
	</Canvas>
);