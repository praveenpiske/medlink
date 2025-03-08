import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Heart = (props) => {
    const heartRef = useRef(); // Create a reference for the heart model

    useGSAP(() => {
        gsap.to(heartRef.current.rotation, {
            y: "+=360",  // Rotate infinitely on Y-axis
            duration: 1000, // Adjust rotation speed
            repeat: -1,  // Infinite loop
            ease: "linear"
        });
    });

    const { nodes, materials } = useGLTF("/realistic_human_heart.glb");

    return (
        <group ref={heartRef} {...props} dispose={null}>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={0.174}>
                <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.hartZBrush_defualt_group_Heart_Tex_0.geometry}
                        material={materials.Heart_Tex}
                        scale={286.365}
                    />
                </group>
            </group>
        </group>
    );
};

// Preload the model to optimize loading
useGLTF.preload("/realistic_human_heart.glb");

export default Heart;
