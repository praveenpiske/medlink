import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Stethoscope = (props) => {

        const StethescopeRef = useRef(); // Create a reference for the heart model
    
        useGSAP(() => {
            gsap.to(StethescopeRef.current.rotation, {
                y: "+=360",  // Rotate infinitely on Y-axis
                duration: 1000, // Adjust rotation speed
                repeat: -1,  // Infinite loop
                ease: "linear",
                x:"+=10",
                
            });
        });
    const { nodes, materials } = useGLTF('/doctors_stethoscope.glb');
    return (
        <group  ref={StethescopeRef}{...props} dispose={null}>
            <group position={[-0.879, -0.627, 0]} scale={0.115}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_4.geometry}
                    material={materials.Material}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_5.geometry}
                    material={materials['Material.001']}
                />
            </group>
        </group>
    );
};

useGLTF.preload('/doctors_stethoscope.glb');

export default Stethoscope;