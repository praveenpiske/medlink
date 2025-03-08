import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

const Tablets = (props) => {
    const { nodes, materials } = useGLTF('/tablets.glb');
    return (
        <group {...props} dispose={null}>
            <group scale={0.01}>
                <group
                    position={[1.009, 177.683, 81.045]}
                    rotation={[-1.479, -0.376, 0.196]}
                    scale={80.996}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Sphere_Material002_0.geometry}
                        material={materials['Material.002']}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Sphere_Material_0.geometry}
                        material={materials.Material}
                    />

<group
          position={[218.796, 434.225, 81.045]}
          rotation={[-1.225, 1.026, -0.588]}
          scale={30.996}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.newcap21_Material002_0.geometry}
            material={materials['Material.002']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.newcap21_Material001_0.geometry}
            material={materials['Material.001']}
          />
        </group>

        <group
          position={[286.646, 145.429, 168.198]}
          rotation={[1.056, -0.965, 3.011]}
          scale={30.996}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Sphere005_Material_0.geometry}
            material={materials.Material}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Sphere005_Material002_0.geometry}
            material={materials['Material.002']}
          />
        </group>

        <group
          position={[-319.642, 257.754, 129.705]}
          rotation={[0.712, 0.891, -2.62]}
          scale={30.996}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.newcap2003_Material002_0.geometry}
            material={materials['Material.002']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.newcap2003_Material001_0.geometry}
            material={materials['Material.001']}
          />
        </group>
                </group>
                <group
                    position={[218.796, 434.225, 81.045]}
                    rotation={[-1.225, 1.026, -0.588]}
                    scale={80.996}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.newcap21_Material002_0.geometry}
                        material={materials['Material.002']}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.newcap21_Material001_0.geometry}
                        material={materials['Material.001']}
                    />
                </group>
                
                {/* ... (rest of your groups and meshes) ... */}
                
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube002__0.geometry}
                    material={materials.Cube__0}
                    position={[612.6, 275.668, 16.992]}
                    rotation={[1.804, 0.474, -2.43]}
                    scale={77.832}
                />

                
            </group>
            
        </group>
    );
};

useGLTF.preload('/tablets.glb');

export default Tablets;